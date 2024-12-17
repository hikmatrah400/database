import React, { useContext, useEffect, useState } from "react";
import "../Styles/Gridveiw.scss";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Delete } from "@mui/icons-material";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckBoxClick,
  SelectAllClick,
  FilterRow,
  generateNewDateTime,
} from "../../Functions/Functions";
import SimpleLoad from "../../UI/SimpleLoad";
import { useLocation } from "react-router-dom";
import { historyApi } from "../../Apis";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const Gridveiw = ({
  gridHeight,
  marginTop,
  ApiName,
  setPurchaseData,
  setSellData,
  Data,
  DeleteObj,
  load,
  FilterSellType,
  FilterData,
  purchaseData,
  sellData,
  IndexNum,
  Login,
  InputData,
  PrevInput,
  total,
  FilterRows,
  ResetData,
  FilterType,
  totalShortCut,
  Options,
  FilterGridType,
  GetItemData,
  setDataAndFilter,
  GetOptions,
  GetDealers,
  GetTypes,
  setLoading,
  pagePath,
  More,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [itemSelected, setItemSelected] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    FilterRows[1]({
      itemVal: "",
      searchVal: "",
      prevItem: "",
      prevSearch: "",
    });

    setItemSelected([]);
    // eslint-disable-next-line
  }, []);

  const DarkTooltip = withStyles(() => ({
    tooltip: {
      fontSize: "1.5rem",
      padding: "0.5rem 1.2rem",
      background: "#1a1a1a",
      color: "#fff",
    },
    arrow: {
      color: "#1a1a1a",
    },
  }))(Tooltip);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const FilterRecords = FilterRow.filterBtn(
    FilterRow.searchTextBox(setAnchorEl, FilterRows)
  );
  const FilterLowerItems = FilterRow.filterRecords(
    FilterData[0],
    FilterRows[0].itemVal,
    Data[1],
    (res) => totalShortCut(res)
  );

  const FilterGridTypes = (data, value) => {
    const res = data.filter((elm) =>
      value === "All" ? elm : elm.type === value
    );
    const filterMain = res.filter((elm) => elm.sellType === FilterType[0]);
    const showData = FilterType[0] === "All" || More ? res : filterMain;

    // setDataAndFilter(showData);
    Data[1](showData);
    FilterData[1](showData);
    totalShortCut(showData);
  };

  const SelectRow = (id, item, delaer, type, qty) => {
    try {
      const getType = purchaseData.filter((elm) => elm.item === item);

      if (getType.length > 0) {
        IndexNum[1](id);

        const data = Data[0].find((elm) => elm._id === id);
        const month = new Date(data.date).toLocaleString("en-Us", {
          month: "2-digit",
        });
        const year = new Date(data.date).getFullYear();
        const day = new Date(data.date).toLocaleString("en-Us", {
          day: "2-digit",
        });

        if (!More) {
          Options[1]((prev) => {
            return {
              ...prev,
              gridQtys: qty,
            };
          });

          GetTypes(item);
          GetItemData(item, "type", type);

          if (delaer !== "") {
            GetItemData(item, "delaer", delaer);
          }
          GetDealers(item);
        }

        const inputData = {
          ...data,
          date: `${year}-${month}-${day}`,
          commission: data.commission > 0 ? data.commission / qty : "",
        };

        InputData[1](inputData);
        PrevInput[1](inputData);
      } else
        ModalDialog.error(
          "Failed",
          "This Record has been Deleted in Purchase List!"
        );
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
          const newHisDate = generateNewDateTime();

          const filterData = DeleteObj[0].filter((elm) => elm.delId === "");
          const deletedData = DeleteObj[0].filter((elm) => elm.delId !== "");
          console.log(deletedData);
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
              _id: Login[0].id,
              userType: Login[0].type,
              username: Login[0].user,
              path: Login[0].path,
              pageName: location.pathname.includes("purchaseList")
                ? "Purchase List"
                : location.pathname.includes("sellList")
                ? "Sell List"
                : null,
              delId: "",
              history: historyMapData,
            };

            axios
              .post(`${historyApi}/saveData`, historyData, {
                headers: { "auth-token": authToken },
              })
              .catch((err) => {
                setLoading(false);
                setDataAndFilter(Data[0]);
                GetOptions(Data[0]);
                if (err.stack.includes("Network Error"))
                  ModalDialog.error(
                    "Network Error",
                    "Can't Connect to Server!"
                  );
              });
          }

          setDataAndFilter(filterData);
          GetOptions(More ? filterData : purchaseData);
          if (More) setPurchaseData(filterData);
          else setSellData(filterData);

          FilterGridTypes(filterData, FilterGridType[0]);
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

          toast.success(
            `Record${itemSelected.length > 1 ? "s" : ""} Deleted Successfully.`
          );

          for (let i = 0; i < itemSelected.length; i++) {
            axios
              .delete(`${ApiName}/deleteData/${itemSelected[i]}`, {
                headers: { "auth-token": authToken },
              })
              .catch((err) => {
                setLoading(false);
                setDataAndFilter(Data[0]);
                GetOptions(Data[0]);

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
    <>
      <div className={`col-12 mt-${marginTop} pt-5 pt-xl-3 allGridContainer`}>
        <div className="position-relative px-2 pt-lg-0">
          <h3
            className="position-absolute start-1 top-0"
            style={{ marginTop: "1rem" }}
          >
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

          <div
            className="position-absolute end-0 top-0 d-flex justify-content-between"
            style={{ marginTop: "-2.5rem" }}
          >
            <div>
              <label className="form-label fs-4">Types:</label>
              <select
                value={FilterGridType[0]}
                onChange={(e) => {
                  FilterGridType[1](e.target.value);
                  FilterRows[1]((prev) => ({ ...prev, searchVal: "" }));
                  FilterGridTypes(
                    More ? purchaseData : sellData,
                    e.target.value
                  );
                }}
                className="form-select me-3"
                style={{ width: "13.5rem", fontSize: "1.6rem" }}
              >
                <option value="All">All</option>
                <option value={pagePath ? "Afghan Land" : "Stock Market"}>
                  {pagePath ? "Afghan Land" : "Stock Market"}
                </option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>

            {!More && (
              <div>
                <label className="form-label fs-4">Sell Types:</label>
                <select
                  value={FilterType[0]}
                  onChange={(e) => {
                    FilterType[1](e.target.value);
                    FilterRows[1]((prev) => ({ ...prev, searchVal: "" }));
                    FilterSellType(e.target.value);
                  }}
                  className="form-select"
                  style={{ width: "9.2rem", fontSize: "1.6rem" }}
                >
                  <option value="All">All</option>
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-center mt-5 pt-5 pt-md-0 mt-md-0">
          {More ? "Purchase" : "Sell"} List
        </h1>

        <div
          className="table-responsive mt-4 gridView"
          style={{ height: gridHeight }}
        >
          <table className="table table-hover">
            <tbody>
              {load ? (
                <>
                  <tr>
                    <td colSpan={15}>
                      <div className="d-flex justify-content-center align-items-center">
                        <SimpleLoad />
                        <span className="ms-3 fw-medium">
                          Data is Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              ) : Data[0].length === 0 ? (
                <tr>
                  <td colSpan={15}>No Data Found!</td>
                </tr>
              ) : (
                Data[0].map((elm, ind) => {
                  const {
                    _id: id,
                    date,
                    code,
                    item,
                    billNum,
                    qty,
                    retailPrice,
                    sellPrice,
                    commission,
                    type,
                    sellType,
                    total,
                    balance,
                    dealerBalance,
                    profit,
                    delaer,
                  } = elm;
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
                            onChange={() =>
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
                            onClick={() =>
                              SelectRow(id, item, delaer, type, qty)
                            }
                          >
                            <MdEditDocument />
                          </IconButton>
                        </div>
                      </td>
                      <td style={rowStyle}>{ind + 1}</td>
                      <td style={rowStyle}>{date}</td>
                      {More && <td style={rowStyle}>{billNum}</td>}
                      <td style={rowStyle}>{code}</td>
                      <td style={rowStyle}>{item}</td>

                      <td style={rowStyle}>{qty}</td>
                      {More && (
                        <td style={rowStyle}>
                          {Number(retailPrice).toLocaleString()}
                        </td>
                      )}
                      <td style={rowStyle}>
                        {Number(sellPrice).toLocaleString()}
                      </td>
                      <td style={rowStyle}>{Number(total).toLocaleString()}</td>
                      <td style={rowStyle}>{type}</td>
                      {!More && <td style={rowStyle}>{sellType}</td>}
                      <td style={rowStyle}>{delaer === "" ? "N/A" : delaer}</td>
                      {!More && (
                        <td style={rowStyle}>
                          {Number(commission).toLocaleString()}
                        </td>
                      )}
                      {!More && (
                        <td style={rowStyle}>
                          {Number(balance).toLocaleString()}
                        </td>
                      )}
                      {!More && (
                        <td style={rowStyle}>
                          {Number(dealerBalance).toLocaleString()}
                        </td>
                      )}
                      {!More && Login[0].path === "all" && (
                        <td style={rowStyle}>
                          {Number(profit).toLocaleString()}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>

            <thead>
              <tr>
                <th className="px-5 px-xl-0">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      itemSelected.length > 0 &&
                      itemSelected.length < Data[0].length
                    }
                    checked={
                      Data[0].length > 0 &&
                      itemSelected.length === Data[0].length
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
                {More && (
                  <th className="px-4 px-xl-0">
                    Bill# {FilterRecords("billNum")}
                  </th>
                )}
                <th className="px-4 px-xl-0">Code {FilterRecords("code")}</th>
                <th className="px-4 px-xl-0">Item {FilterRecords("item")}</th>

                <th className="px-4 px-xl-0">QTY {FilterRecords("qty")}</th>
                {More && (
                  <th className="px-4 px-xl-0">
                    Cost {FilterRecords("retailPrice")}
                  </th>
                )}
                <th className="px-4 px-xl-0">
                  {More ? "Sell Price" : "Price"} {FilterRecords("sellPrice")}
                </th>
                <th className="px-4 px-xl-0">Total</th>

                <th className="px-4 px-xl-0">Type</th>
                {!More && <th className="px-4 px-xl-0">Sell Type</th>}
                <th className="px-4 px-xl-0">
                  DLR Name {FilterRecords("delaer")}
                </th>

                {!More && (
                  <>
                    <th className="px-4 px-xl-0">
                      Comm {FilterRecords("commission")}
                    </th>

                    <th className="px-4 px-xl-0">
                      {pagePath ? "AL" : "SM"} Balance{" "}
                      {FilterRecords("balance")}
                    </th>

                    <th className="px-4 px-xl-0">
                      DLR Balance {FilterRecords("dealerBalance")}
                    </th>

                    {Login[0].path === "all" && (
                      <th className="px-4 px-xl-0">Profit</th>
                    )}
                  </>
                )}
              </tr>
            </thead>

            <tfoot>
              <tr>
                <th colSpan={More ? 5 : 4}>Grand Total</th>
                <th></th>

                <th>{load ? 0 : total.qtys}</th>

                <th colSpan={More ? 2 : 1}></th>
                <th>{load ? 0 : total.grandTotal}</th>
                {!More && <th></th>}
                <th></th>
                {More && <th></th>}

                {!More && (
                  <>
                    <th></th>
                    <th>{load ? 0 : total.commissions}</th>
                    <th>{load ? 0 : total.balances}</th>
                    <th>{load ? 0 : total.dealerBalances}</th>
                  </>
                )}

                {!More && Login[0].path === "all" && (
                  <th>{load ? 0 : total.profits}</th>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <FilterRow.Menu
        {...{ open, anchorEl, handleClose, FilterRows }}
        filterRecord={FilterLowerItems}
      />
    </>
  );
};

export default Gridveiw;
