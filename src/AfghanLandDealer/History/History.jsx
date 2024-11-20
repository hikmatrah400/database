import React, { useContext, useState } from "react";
import { Delete } from "@material-ui/icons";
import {
  Backdrop,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import GridRow from "./GridRow";
import SimpleLoad from "../../UI/SimpleLoad";
import { SelectAllClick } from "../../Functions/Functions";
import { toast } from "react-toastify";
import { historyApi } from "../../Apis";
import axios from "axios";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";
// import { MdEditDocument } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

const History = ({
  load,
  userData,
  choosePage,
  filterUsers,
  showHistory,
  HistoryData,
  updateData,
  setShowHistory,
  DeleteObj,
  ChooseType,
}) => {
  // const navigate = useNavigate();
  const ModalDialog = useContext(ShowDialog);

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };
  const StableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const buttons = ["updated", "deleted"];
  const [styleBtn, setStyleBtn] = useState("btn1");
  const [itemSelected, setItemSelected] = useState([]);

  const mapData = HistoryData[0].history.filter(
    (elm) => elm.rowType === ChooseType[0]
  );
  const filterType = StableSort(mapData, getComparator("desc", "modifyed"));

  const page =
    choosePage === "Purchase List"
      ? "prl"
      : choosePage === "Sell List"
      ? "sll"
      : choosePage === "Expense List"
      ? "exl"
      : null;

  const DarkTooltip = withStyles(() => ({
    tooltip: {
      fontSize: 14,
      padding: "0.5rem 1.2rem",
      background: "#1a1a1a",
      color: "#fff",
    },
    arrow: {
      color: "#1a1a1a",
    },
  }))(Tooltip);

  const DeleteHistory = () => {
    ModalDialog.success(
      "Please Confirm",
      "Would you like to Delete?",
      "Yes/No",
      () => {
        const filterData = DeleteObj[0].filter((elm) => elm.delId === "");
        const filterMainData = updateData[0].filter((elm) => elm.delId === "");
        HistoryData[1]((prev) => ({ ...prev, history: filterData }));
        DeleteObj[1](filterData);
        updateData[1](filterMainData);

        toast.success(
          `Record${itemSelected.length > 1 ? "s" : ""} Deleted Successfully.`
        );

        for (let i = 0; i < itemSelected.length; i++) {
          axios.delete(`${historyApi}/${itemSelected[i]}`).catch(() => {
            HistoryData[1](HistoryData[0]);
            DeleteObj[1](HistoryData[0]);
            ModalDialog.error("Network Error", "Can't Connect to Server!");
          });
        }
        setItemSelected([]);
      }
    );
  };

  // const EditHistory = () => {
  //   const filterRecord = HistoryData[0].history.find(
  //     (elm) => elm.id === itemSelected[0]
  //   );
  //   const month = new Date(filterRecord.date).toLocaleString("en-Us", {
  //     month: "2-digit",
  //   });
  //   const year = new Date(filterRecord.date).getFullYear();
  //   const day = new Date(filterRecord.date).toLocaleString("en-Us", {
  //     day: "2-digit",
  //   });

  //   setInputData({
  //     id: filterRecord.prevID,
  //     date: `${year}-${month}-${day}`,
  //     code: filterRecord.code,
  //     item: filterRecord.item,
  //     billNum: filterRecord.billNum,
  //     qty: filterRecord.qty,
  //     retailPrice: filterRecord.retailPrice,
  //     sellPrice: filterRecord.sellPrice,
  //     sellType: filterRecord.sellType,
  //     commission: filterRecord.commission,
  //     type: filterRecord.type,
  //     total: filterRecord.total,
  //     delaer: filterRecord.delaer,
  //   });
  //   setIndexNum(filterRecord.prevID);
  //   console.log(filterRecord);
  //   GetTypes(filterRecord.item);
  //   GetItemData(filterRecord.item, "type", filterRecord.type);
  //   GetDealers(filterRecord.item);

  //   navigate("/afghanAndDealer/sellList");
  // };

  const filterDelData = (data, bool) =>
    data.filter((elm) =>
      bool ? elm.rowType === ChooseType[0] : elm.rowType !== ChooseType[0]
    );

  const btnStyle = {
    color: "#fff",
    background: "#427987",
  };
  const filterStars = filterType.filter((elm) => elm.star === true);

  return (
    <>
      <Backdrop
        className="backDropCon"
        open={showHistory}
        style={{
          zIndex: 1,
          background: "#fff",
          display: "flex",
          alignItems: "flex-start",
          marginTop: "3.8rem",
        }}
      >
        <div
          className="container-fluid mt-4 historyContainer"
          style={{
            height: "calc(100vh - 60px)",
            overflow: "auto",
          }}
        >
          <h1 className="text-center mt-5">History of {choosePage}</h1>
          <h2
            className="text-center text-primary text-capitalize"
            style={{ fontSize: "2.1rem" }}
          >
            Username: {userData.user}
          </h2>

          <div className="headerBtns mt-5 d-flex justify-content-center">
            {buttons.map((elm, ind) => {
              return (
                <button
                  key={ind}
                  className="btn"
                  style={styleBtn === `btn${ind + 1}` ? btnStyle : null}
                  name={`btn${ind + 1}`}
                  onClick={(e) => {
                    setStyleBtn(e.target.name);
                    ChooseType[1](elm);
                    setItemSelected([]);
                  }}
                >
                  {elm}
                </button>
              );
            })}
          </div>

          <div className="row justify-content-center">
            <div className="col-12">
              <div className="position-relative px-2 pt-lg-0">
                <h3
                  className="position-absolute start-1 top-0"
                  style={{ marginTop: "1rem" }}
                >
                  Starred: {filterStars.length} | Selected:{" "}
                  {itemSelected.length}
                  {itemSelected.length > 0 && (
                    <>
                      <DarkTooltip
                        title={`${
                          itemSelected.length === 1
                            ? "Delete Row"
                            : "Delete Rows"
                        }`}
                        arrow
                      >
                        <IconButton
                          className="deleteBtn ms-4"
                          onClick={DeleteHistory}
                        >
                          <Delete />
                        </IconButton>
                      </DarkTooltip>

                      {/* {itemSelected.length === 1 && (
                        <DarkTooltip title="Edit Row" arrow>
                          <IconButton
                            className="deleteBtn"
                            onClick={EditHistory}
                          >
                            <MdEditDocument style={{ fontSize: "1.8rem" }} />
                          </IconButton>
                        </DarkTooltip>
                      )} */}
                    </>
                  )}
                </h3>
              </div>

              {/* Table Starts ----------------------------- */}

              <TableContainer component={Paper} className="gridView">
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      {ChooseType[0] === "updated" && (
                        <TableCell className="headTh" />
                      )}
                      <TableCell className="headTh" />
                      <TableCell className="headTh">
                        <Checkbox
                          style={{ color: "#fff" }}
                          indeterminate={
                            itemSelected.length > 0 &&
                            itemSelected.length < filterType.length
                          }
                          checked={
                            filterType.length > 0 &&
                            itemSelected.length === filterType.length
                          }
                          onChange={(e) => {
                            SelectAllClick(
                              filterType,
                              itemSelected,
                              setItemSelected,
                              e
                            );

                            if (
                              (filterType.length > 0 &&
                                itemSelected.length === filterType.length) ||
                              (itemSelected.length > 0 &&
                                itemSelected.length < filterType.length)
                            )
                              DeleteObj[1]((prev) =>
                                filterType.map((elm) => ({ ...elm, delId: "" }))
                              );
                            else {
                              const filterTrue = filterDelData(
                                DeleteObj[0],
                                true
                              );
                              const filterFalse = filterDelData(
                                DeleteObj[0],
                                false
                              );

                              const delMainTrue = filterDelData(
                                updateData[0],
                                true
                              );
                              const delMainFalse = filterDelData(
                                updateData[0],
                                false
                              );

                              let data = [];
                              for (let i = 0; i < filterTrue.length; i++) {
                                data = [
                                  ...data,
                                  { ...filterTrue[i], delId: "selected" },
                                ];
                              }

                              let data1 = [];
                              for (let i = 0; i < delMainTrue.length; i++) {
                                data1 = [
                                  ...data1,
                                  { ...delMainTrue[i], delId: "selected" },
                                ];
                              }

                              DeleteObj[1]([...data, ...filterFalse]);
                              updateData[1]((prev) =>
                                prev.map((elm) => {
                                  if (
                                    elm.username === userData.user &&
                                    elm.path === userData.path &&
                                    elm.rowType === ChooseType[0]
                                  )
                                    return [...data1, ...delMainFalse];

                                  return elm;
                                })
                              );
                            }
                          }}
                          inputProps={{
                            "aria-label": "select all desserts",
                          }}
                        />
                      </TableCell>
                      <TableCell className="headTh">S.No</TableCell>
                      <TableCell className="headTh">Date</TableCell>

                      {page === "exl" && (
                        <>
                          <TableCell className="headTh">Description</TableCell>
                          <TableCell className="headTh">Amount</TableCell>
                        </>
                      )}

                      {page === "prl" && (
                        <TableCell className="headTh">Bill#</TableCell>
                      )}

                      {page !== "exl" && (
                        <>
                          <TableCell className="headTh">Code</TableCell>
                          <TableCell className="headTh">Item</TableCell>
                          <TableCell className="headTh">QTY</TableCell>
                          <TableCell className="headTh">
                            {page === "prl"
                              ? "Cost"
                              : page === "sll"
                              ? "Price"
                              : ""}
                          </TableCell>
                        </>
                      )}
                      {page === "prl" && (
                        <TableCell className="headTh">Sell Price</TableCell>
                      )}
                      {page !== "exl" && (
                        <>
                          <TableCell className="headTh">Type</TableCell>
                          <TableCell className="headTh">DLR Name</TableCell>
                        </>
                      )}
                      {page === "sll" && (
                        <>
                          <TableCell className="headTh">Sell Type</TableCell>
                          <TableCell className="headTh">Comm</TableCell>
                        </>
                      )}
                      <TableCell className="headTh">Modified</TableCell>
                      <TableCell className="headTh">Read / Unread</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {load ? (
                      <>
                        <tr>
                          <td colSpan={15} style={{ padding: "0.8rem" }}>
                            <div className="d-flex justify-content-center align-items-center">
                              <SimpleLoad />
                              <span className="ms-3 fw-medium">
                                Data is Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : filterType.length === 0 ? (
                      <tr>
                        <td colSpan={15} style={{ padding: "0.8rem" }}>
                          No Data Found!
                        </td>
                      </tr>
                    ) : (
                      filterType.map((row, ind) => (
                        <GridRow
                          key={ind}
                          {...{
                            ind,
                            row,
                            page,
                            DeleteObj,
                            itemSelected,
                            setItemSelected,
                            HistoryData,
                            rowType: ChooseType[0],
                            updateData: updateData[1],
                          }}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <Button
              className="backBtn"
              onClick={() => {
                filterUsers(updateData[0], choosePage);
                setItemSelected([]);
                setShowHistory(false);
              }}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default History;
