import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { historyApi } from "../../Apis";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";
import { generateShortDate, generateTime } from "../../Functions/Functions";

const ShowCode = ({ inputCol, code, ChangeInputs, More }) => {
  return (
    <div className={inputCol}>
      <label className="form-label">Code:</label>
      <input
        autoComplete="off"
        type="text"
        name="code"
        value={code}
        onChange={ChangeInputs}
        className="form-control"
        required
        disabled={!More}
      />
    </div>
  );
};

const ShowType = ({
  pagePath,
  inputCol,
  type,
  ChangeInputs,
  More,
  item,
  Options,
  delaer,
  GetItemData,
  GetDealers,
}) => {
  return (
    <>
      <div className={inputCol}>
        <label className="form-label">Type:</label>
        <select
          name="type"
          value={type}
          onChange={(e) => {
            ChangeInputs(e);
            if (!More && e.target.value) {
              GetItemData(item, "type", e.target.value);
              GetDealers(item);
            }
          }}
          className="form-select"
          required
          disabled={!More && item === ""}
        >
          <option value="" disabled>
            {!More && Options[0].types.length === 0
              ? "No Types Found"
              : "Choose..."}
          </option>

          {More ? (
            <>
              <option value={pagePath ? "Afghan Land" : "Stock Market"}>
                {pagePath ? "Afghan Land" : "Stock Market"}
              </option>
              {/* <option value="Tek Delivery Service(Cargo)">
                Tek Delivery Service(Cargo)
              </option>
              <option value="Stock Market Shop">Stock Market Shop</option> */}
              <option value="Dealer">Dealer</option>
            </>
          ) : (
            Options[0].types.map((elm, i) => {
              return (
                <option key={i} value={elm}>
                  {elm}
                </option>
              );
            })
          )}
        </select>
      </div>

      {type === "Dealer" && (
        <div className={inputCol}>
          <label className="form-label">Dealer Name:</label>
          <datalist id="dealerList">
            {Options[0].purDealers.map((elm, i) => (
              <option key={i} value={elm} />
            ))}
          </datalist>

          {More ? (
            <input
              autoFocus
              autoComplete="off"
              type="search"
              name="delaer"
              value={delaer}
              list="dealerList"
              onChange={ChangeInputs}
              className="form-control"
              required
            />
          ) : (
            <select
              autoFocus
              className="form-select"
              name="delaer"
              value={delaer}
              onChange={ChangeInputs}
              onMouseUp={
                delaer !== ""
                  ? () => GetItemData(item, "delaer", delaer)
                  : undefined
              }
              required
            >
              <option value="" disabled>
                Choose...
              </option>
              {Options[0].dealers.map((elm, i) => {
                return (
                  <option key={i} value={elm}>
                    {elm}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}
    </>
  );
};

const InputList = ({
  currentDate,
  InputData,
  PrevInput,
  GetTypes,
  load,
  Data,
  purchaseData,
  sellData,
  SaveData,
  UpdateData,
  setDataAndFilter,
  setPurchaseData,
  setSellData,
  ApiName,
  Login,
  GetItemCode,
  GetOptions,
  IndexNum,
  setLoading,
  ResetData,
  Options,
  GetItemData,
  GetDealers,
  More,
  FilterType,
  FilterGridType,
  pagePath,
}) => {
  const [updateData, setUpdateData] = useState([]);
  const ModalDialog = useContext(ShowDialog);
  const inputCol = "col-11 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";
  const {
    date,
    code,
    item,
    billNum,
    qty,
    retailPrice,
    sellPrice,
    type,
    sellType,
    commission,
    delaer,
  } = InputData[0];

  const ChangeInputs = (e) => {
    const { name, type, value } = e.target;

    if (IndexNum[0]) {
      if (
        PrevInput[0][name] !==
        (type === "number" ? value !== "" && Number(value) : value)
      )
        setUpdateData((prev) => [...prev, name]);
      else setUpdateData((prev) => prev.filter((elm) => elm !== name));
    }

    InputData[1]((prev) => {
      return {
        ...prev,
        [name]: type === "number" ? value !== "" && Number(value) : value,
      };
    });
  };

  useEffect(() => {
    ResetData();
    setUpdateData([]);
    // eslint-disable-next-line
  }, []);

  const ServerUpdates = (data) => {
    if (More) setPurchaseData(data);
    else setSellData(data);

    setDataAndFilter(data);
    GetOptions(data);
  };

  const SubmitForm = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const Retailtotal = qty * retailPrice;
    const Selltotal = qty * sellPrice;
    const Commission = !commission ? 0 : commission * qty;

    const newDate = generateShortDate(date, false);
    const newHisDate = generateTime(currentDate);

    const sendData = {
      ...InputData[0],
      date: newDate,
      commission: Commission,
      total: More ? Retailtotal : Selltotal,
      profit: More ? 0 : Selltotal - Retailtotal - Commission,
      balance: More ? 0 : Selltotal - Commission,
      dealerBalance: More ? 0 : type !== "Dealer" ? 0 : Retailtotal,
      delaer: type === "Dealer" ? delaer : "",
      pageType: Login[0].adminPath,
      delId: "",
    };

    const filterData = Data[0].find((elm) => elm._id === IndexNum[0]);
    const randomID = `${Math.random() + Math.random()}${new Date()
      .getTime()
      .toString()}`;

    const historyData = {
      _id: Login[0].id,
      userType: Login[0].type,
      username: Login[0].user,
      path: Login[0].path,
      pageName: More ? "Purchase List" : "Sell List",
      delId: "",

      history: [
        {
          ...sendData,
          _id: randomID,
          star: false,
          view: false,
          rowType: "updated",
          modifyed: newHisDate,
          prevData: filterData,
        },
      ],
    };

    const filterCode = Data[0].filter((elm) => elm.code === code);
    const updateCode = filterCode.filter((elm) => elm._id !== IndexNum[0]);

    const filterItem = Data[0].filter((elm) => elm.item === item);
    const getItemIndex = filterItem.filter((elm) => elm._id !== IndexNum[0]);

    if (More && updateCode.length > 0 && updateCode[0].item !== item)
      ModalDialog.error(
        "Dublicate Code",
        `"${filterCode[0].code}" Code already has been existed`
      );
    else if (More && getItemIndex.length > 0 && getItemIndex[0].code !== code)
      ModalDialog.error(
        "Same Code",
        `You have to Enter "${getItemIndex[0].code}" instead of "${code}" Code, Because this item already has been existed on "${getItemIndex[0].code}"`
      );
    else {
      if (IndexNum[0] && updateData.length > 0) {
        if (More) UpdateData(purchaseData, setPurchaseData, sendData);
        else UpdateData(sellData, setSellData, sendData);

        toast.success("Record Updated Successfully.");
        FilterType[1]("All");
        FilterGridType[1]("All");
        setUpdateData([]);

        axios
          .put(`${ApiName}/updateData/${IndexNum[0]}`, sendData, {
            headers: { "auth-token": authToken },
          })
          .then(() => {
            if (Login[0].path !== "all") {
              axios
                .post(`${historyApi}/saveData`, historyData, {
                  headers: { "auth-token": authToken },
                })
                .catch((err) => {
                  setLoading(false);
                  ServerUpdates(Data[0]);
                  if (err.stack.includes("Network Error"))
                    ModalDialog.error(
                      "Network Error",
                      "Can't Connect to Server!"
                    );
                });
            }
          })
          .catch((err) => {
            setLoading(false);
            ServerUpdates(Data[0]);

            if (err.stack.includes("Network Error"))
              ModalDialog.error("Network Error", "Can't Connect to Server!");
          });
      } else if (!IndexNum[0] && updateData.length === 0) {
        if (More) SaveData(setPurchaseData, sendData);
        else SaveData(setSellData, sendData);

        toast.success("Record Saved Successfully.");

        axios
          .post(`${ApiName}/saveData`, sendData, {
            headers: { "auth-token": authToken },
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            ServerUpdates(Data[0]);
            if (err.stack.includes("Network Error"))
              ModalDialog.error("Network Error", "Can't Connect to Server!");
          });
      } else {
        ModalDialog.info(
          "Information",
          "Record did't update because there was no changes!"
        );
      }
    }
  };

  const showTypeObj = {
    pagePath,
    inputCol,
    type,
    ChangeInputs,
    More,
    item,
    Options,
    delaer,
    GetItemData,
    GetDealers,
  };

  return (
    <>
      <div className="col-11 col-lg-12 px-0 px-lg-5">
        <form
          className="row gy-4 gx-5 justify-content-center justify-content-sm-start"
          onSubmit={SubmitForm}
        >
          <div className={inputCol}>
            <label className="form-label">Date:</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={ChangeInputs}
              className="form-control"
              required
            />
          </div>

          {More && (
            <div className={inputCol}>
              <label className="form-label">Bill#:</label>
              <input
                autoFocus
                autoComplete="off"
                type="text"
                name="billNum"
                value={billNum}
                min={0}
                onChange={ChangeInputs}
                className="form-control"
                required
              />
            </div>
          )}

          <div className={inputCol}>
            <label className="form-label">Item Name:</label>

            <datalist id="itemsList">
              {Options[0].items.map((elm, i) => {
                return <option key={i} value={elm} />;
              })}
            </datalist>

            <input
              autoFocus={!More ? true : false}
              autoComplete="off"
              list="itemsList"
              type="search"
              name="item"
              value={item}
              onChange={(e) => {
                ChangeInputs(e);

                if (!More) {
                  GetTypes(e.target.value);
                  InputData[1]((prev) => ({
                    ...prev,
                    type: "",
                    delaer: "",
                    retailPrice: 0,
                    sellPrice: 0,
                  }));
                  Options[1]((prev) => ({
                    ...prev,
                    qtys: 0,
                    sellQtys: 0,
                  }));
                } else GetItemCode(e.target.value);
              }}
              className="form-control"
              required
            />
          </div>

          {!More && (
            <div className={inputCol}>
              <label className="form-label">Sell Type:</label>
              <select
                className="form-select"
                name="sellType"
                value={sellType}
                onChange={ChangeInputs}
                required
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
          )}

          {More && <ShowCode {...{ inputCol, code, ChangeInputs, More }} />}
          {!More && <ShowType {...showTypeObj} />}
          {!More && <ShowCode {...{ inputCol, code, ChangeInputs, More }} />}

          <div className={inputCol}>
            <label className="form-label">
              QTY:
              {!More &&
                `${` | Stock: ${
                  (type === "Dealer" && delaer === "") || Options[0].qtys < 0
                    ? 0
                    : Options[0].qtys
                } | Sold: ${
                  type === "Dealer" && delaer === "" ? 0 : Options[0].sellQtys
                }`}`}
            </label>
            <input
              type="number"
              name="qty"
              value={qty}
              min={1}
              max={
                More
                  ? undefined
                  : IndexNum[0]
                  ? Options[0].qtys + Options[0].gridQtys
                  : Options[0].qtys
              }
              onChange={ChangeInputs}
              className="form-control"
              required
              disabled={!More && type === ""}
            />
          </div>

          {More && (
            <div className={inputCol}>
              <label className="form-label">Cost:</label>
              <input
                type="number"
                name="retailPrice"
                value={retailPrice}
                min={1}
                onChange={ChangeInputs}
                className="form-control"
                required
              />
            </div>
          )}

          <div className={inputCol}>
            <label className="form-label">
              Sell:
              {!More && ` | Cost: ${type && retailPrice > 0 ? retailPrice : 0}`}
            </label>
            <input
              type="number"
              name="sellPrice"
              value={type !== "Dealer" || delaer || More ? sellPrice : ""}
              min={retailPrice + 1}
              onChange={ChangeInputs}
              className="form-control"
              required
            />
          </div>

          <div className={inputCol}>
            <label className="form-label">Total:</label>
            <input
              autoComplete="off"
              type="number"
              value={More ? retailPrice * qty : sellPrice * qty}
              className="form-control"
              disabled
            />
          </div>

          {!More && (
            <>
              <div className={inputCol}>
                <div className="row">
                  <div className="col-6">
                    <label className="form-label">Each Comm:</label>

                    <input
                      type="number"
                      name="commission"
                      value={commission}
                      onChange={ChangeInputs}
                      className="form-control"
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Total Comm:</label>

                    <input
                      type="number"
                      value={commission * qty}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className={inputCol}>
                <label className="form-label">
                  {pagePath ? "Afghan Land" : "Stock Market"} Balance:
                </label>
                <input
                  type="number"
                  value={sellPrice * qty - commission * qty}
                  onChange={ChangeInputs}
                  className="form-control"
                  disabled
                />
              </div>

              {type === "Dealer" && (
                <div className={inputCol}>
                  <label className="form-label">Dealer Balance:</label>
                  <input
                    type="number"
                    value={retailPrice * qty}
                    className="form-control"
                    disabled
                  />
                </div>
              )}

              {Login[0].path === "all" && (
                <div className={inputCol}>
                  <label className="form-label">Profit:</label>
                  <input
                    type="number"
                    value={
                      qty
                        ? qty * sellPrice - qty * retailPrice - commission * qty
                        : 0
                    }
                    className="form-control"
                    required
                    disabled
                  />
                </div>
              )}
            </>
          )}

          {More && <ShowType {...showTypeObj} />}

          <div className="col-12 col-xl-5 col-xxl-4">
            <div className="row gy-3 mt-0 mt-sm-4 justify-content-center justify-content-xl-start">
              <div className="col-4 col-sm-3 col-md-2 col-xl-3">
                <Button
                  disabled={load}
                  type="submit"
                  className={`formBtn ${IndexNum[0] ? "updateBtn" : "saveBtn"}`}
                >
                  {IndexNum[0] ? "Update" : "Save"}
                </Button>
              </div>

              <div className="col-4 col-sm-3 col-md-2 col-xl-3">
                <Button
                  className="formBtn saveBtn"
                  onClick={() => {
                    ResetData();
                    setUpdateData([]);
                  }}
                >
                  {IndexNum[0] ? "Cancel" : "Reset"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InputList;
