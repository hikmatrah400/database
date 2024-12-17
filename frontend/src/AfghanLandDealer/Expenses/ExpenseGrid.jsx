import React, { useContext, useState } from "react";
import { Delete } from "@mui/icons-material";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import {
  CheckBoxClick,
  FilterRow,
  SelectAllClick,
  generateNewDateTime,
} from "../../Functions/Functions";
import { withStyles } from "@mui/styles";
import { historyApi } from "../../Apis";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import SimpleLoad from "../../UI/SimpleLoad";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const ExpenseGrid = ({
  apiName,
  load,
  Login,
  DeleteObj,
  updateStates,
  setExpenseData,
  Data,
  FilterRows,
  PrevInput,
  filterData,
  IndexNum,
  totalShortCut,
  setInputData,
  ResetData,
  setLoading,
  Total,
}) => {
  const ModalDialog = useContext(ShowDialog);

  const [anchorEl, setAnchorEl] = useState(null);
  const [itemSelected, setItemSelected] = useState([]);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const FilterRecords = FilterRow.filterBtn(
    FilterRow.searchTextBox(setAnchorEl, FilterRows)
  );
  const FilterLowerItems = FilterRow.filterRecords(
    filterData,
    FilterRows[0].itemVal,
    Data[1],
    (res) => totalShortCut(res)
  );

  const SelectRow = (id) => {
    try {
      const data = Data[0].find((elm) => elm._id === id);
      const month = new Date(data.date).toLocaleString("en-Us", {
        month: "2-digit",
      });
      const year = new Date(data.date).getFullYear();
      const day = new Date(data.date).toLocaleString("en-Us", {
        day: "2-digit",
      });

      IndexNum[1](id);

      const getInputData = { ...data, date: `${year}-${month}-${day}` };
      setInputData(getInputData);
      PrevInput[1](getInputData);
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteRows = () => {
    const authToken = localStorage.getItem("authToken");

    if (itemSelected.length === 0) {
      ModalDialog.error("Error", "Please Select a Row");
    } else {
      ModalDialog.success(
        "Please Confirm",
        "Would you like to Delete?",
        "Yes/No",
        () => {
          // setLoading(true);
          const filterData = DeleteObj[0].filter((elm) => elm.delId === "");
          const deletedData = DeleteObj[0].filter((elm) => elm.delId !== "");
          const newHisDate = generateNewDateTime();

          if (Login[0].path !== "all") {
            const randomID = `${Math.random() + Math.random()}${new Date()
              .getTime()
              .toString()}`;

            const historyMapData = deletedData.map((elm, i) => ({
              ...elm,
              _id: randomID + i,
              star: false,
              view: false,
              rowType: "deleted",
              modifyed: newHisDate,
              prevData: undefined,
              delId: "",
            }));

            const historyData = {
              _id: Login[0].id + "exp",
              userType: Login[0].type,
              username: Login[0].user,
              path: Login[0].path,
              pageName: "Expense List",
              delId: "",
              history: historyMapData,
            };

            axios
              .post(`${historyApi}/saveData`, historyData, {
                headers: { "auth-token": authToken },
              })
              .catch((err) => {
                setLoading(false);
                setExpenseData(Data[0]);
                updateStates(Data[0]);
                if (err.stack.includes("Network Error"))
                  ModalDialog.error(
                    "Network Error",
                    "Can't Connect to Server!"
                  );
              });
          }

          setExpenseData(filterData);
          updateStates(filterData);

          if (FilterRows[0].searchVal !== "") {
            const res = filterData.filter((f) =>
              f[FilterRows[0].itemVal]
                .toString()
                .toLowerCase()
                .includes(FilterRows[0].searchVal)
            );
            Data[1](res);
            totalShortCut(res);
          }

          toast.success("Records Deleted Successfully.");

          for (let i = 0; i < itemSelected.length; i++) {
            axios
              .delete(`${apiName}/deleteData/${itemSelected[i]}`, {
                headers: { "auth-token": authToken },
              })
              .catch((err) => {
                setLoading(false);
                setExpenseData(Data[0]);
                updateStates(Data[0]);

                if (err.stack.includes("Network Error"))
                  ModalDialog.error(
                    "Network Error",
                    "Can't Connect to Server!"
                  );
              });
          }
          setItemSelected([]);
        }
      );
    }
  };

  return (
    <div className="allGridContainer">
      <div className="position-relative px-2 pt-2 pt-lg-0">
        <h3 className="pt-3 position-absolute start-1 top-0">
          Selected: {itemSelected.length}
          <DarkTooltip
            title={`${
              itemSelected.length === 0
                ? "Select Row"
                : itemSelected.length === 1
                ? "Delete Row"
                : "Delete Rows"
            }`}
            arrow
          >
            <IconButton className="deleteBtn" onClick={DeleteRows}>
              <Delete />
            </IconButton>
          </DarkTooltip>
        </h3>

        <h1 className="text-center">Expenses List</h1>
      </div>

      <div
        className="table-responsive mt-4 gridView"
        style={{ height: "55vh" }}
      >
        <table className="table table-hover">
          <tbody>
            {load ? (
              <>
                <tr>
                  <td colSpan={5}>
                    <div className="d-flex justify-content-center align-items-center">
                      <SimpleLoad />
                      <span className="ms-3 fw-medium">Data is Loading...</span>
                    </div>
                  </td>
                </tr>
              </>
            ) : Data[0].length === 0 ? (
              <tr>
                <td colSpan={5}>No Data Found</td>
              </tr>
            ) : (
              Data[0].map((elm, ind) => {
                const { _id: id, date, description, amount } = elm;
                const isItemSelected = itemSelected.indexOf(id) !== -1;

                const rowStyle = {
                  background:
                    IndexNum[0] === id
                      ? "#daf7ff"
                      : isItemSelected
                      ? "#feebf2"
                      : "transparent",
                };

                return (
                  <tr key={ind}>
                    <td className="selectIcon" style={rowStyle}>
                      <div className="d-flex justify-content-evenly align-items-center mt-2">
                        <Checkbox
                          className="gridCheckBox"
                          style={{
                            padding: "0rem",
                            zoom: "120%",
                          }}
                          onClick={() =>
                            CheckBoxClick(
                              itemSelected,
                              setItemSelected,
                              id,
                              (DeleteObj = DeleteObj[1])
                            )
                          }
                          checked={isItemSelected}
                          disabled={IndexNum[0] === id}
                        />

                        <IconButton
                          className="p-0"
                          disabled={isItemSelected}
                          onClick={() => SelectRow(id)}
                        >
                          <MdEditDocument />
                        </IconButton>
                      </div>
                    </td>

                    <td style={rowStyle}>{ind + 1}</td>
                    <td style={rowStyle}>{date}</td>
                    <td style={rowStyle}>{description}</td>
                    <td style={rowStyle}>{Number(amount).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>

          <thead>
            <tr>
              <th>
                <Checkbox
                  color="primary"
                  indeterminate={
                    itemSelected.length > 0 &&
                    itemSelected.length < Data[0].length
                  }
                  checked={
                    Data[0].length > 0 && itemSelected.length === Data[0].length
                  }
                  onChange={(e) => {
                    SelectAllClick(Data[0], itemSelected, setItemSelected, e);
                    ResetData();

                    if (
                      (Data[0].length > 0 &&
                        itemSelected.length === Data[0].length) ||
                      (itemSelected.length > 0 &&
                        itemSelected.length < Data[0].length)
                    )
                      DeleteObj[1](
                        DeleteObj[0].map((elm) => ({ ...elm, delId: "" }))
                      );
                    else {
                      const newData = [
                        ...Data[0].map((elm) => ({ ...elm, delId: elm._id })),
                        ...DeleteObj[0],
                      ];

                      const filterData = newData.filter(
                        (elm, i) =>
                          i ===
                          newData.findIndex((elm2) => elm2._id === elm._id)
                      );

                      DeleteObj[1](filterData);
                    }
                  }}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                  style={{ padding: "0" }}
                />
              </th>
              <th className="px-4 px-xl-0">S.No</th>
              <th className="px-4 px-xl-0">Date {FilterRecords("date")}</th>
              <th className="px-4 px-xl-0" style={{ width: "55%" }}>
                Description {FilterRecords("description")}
              </th>
              <th className="px-4 px-xl-0">
                Ammount {FilterRecords("amount")}
              </th>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <th colSpan={3}>Grand Total</th>
              <th>{Total[0].descriptions}</th>
              <th>{Total[0].amount.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <FilterRow.Menu
        {...{ open, anchorEl, handleClose, FilterRows }}
        filterRecord={FilterLowerItems}
      />
    </div>
  );
};

export default ExpenseGrid;
