import React, { useContext, useEffect, useState } from "react";
import NoPageFound from "../../NoPageFound/NoPageFound";
import { Button } from "@mui/material";
import ExpenseGrid from "./ExpenseGrid";
import axios from "axios";
import { toast } from "react-toastify";
import {
  RowStyle,
  SumNumberArray,
  filterPageType,
  generateNewDateTime,
  generateShortDate,
} from "../../Functions/Functions";
import { expenseApi, historyApi } from "../../Apis";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";
import { useParams } from "react-router-dom";

const AfghanLandExpense = ({
  pagePath,
  load,
  PrevInput,
  setExpenseData,
  expenseData,
  purchaseData,
  sellData,
  Login,
  FilterRows,
  DeleteObj,
  GetOneData,
  setLoading,
}) => {
  const { path } = useParams();
  const ModalDialog = useContext(ShowDialog);
  const [updateData, setUpdateData] = useState([]);

  const month = new Date().toLocaleString("en-Us", { month: "2-digit" });
  const year = new Date().getFullYear();
  const day = new Date().toLocaleString("en-Us", { day: "2-digit" });

  const inputCol = "col-11 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";
  const [indexNum, setIndexNum] = useState(null);

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [total, setTotal] = useState({
    descriptions: 0,
    amount: 0,
  });

  const randomID = `${Math.random() + Math.random()}${new Date()
    .getTime()
    .toString()}`;
  const [inputData, setInputData] = useState({
    _id: randomID,
    date: `${year}-${month}-${day}`,
    description: "",
    amount: "",
  });
  const { date, description, amount } = inputData;

  const ChangeInputs = (e) => {
    const { name, type, value } = e.target;

    if (indexNum) {
      if (
        PrevInput[0][name] !==
        (type === "number" ? value !== "" && Number(value) : value)
      )
        setUpdateData((prev) => [...prev, name]);
      else setUpdateData((prev) => prev.filter((elm) => elm !== name));
    }

    setInputData((prev) => ({
      ...prev,
      [name]: type === "number" ? value !== "" && Number(value) : value,
    }));
  };

  const updateStates = (data) => {
    setData(data);
    setFilterData(data);
    totalShortCut(data);
    DeleteObj[1](data);
  };

  const ResetData = () => {
    setInputData({
      _id: randomID,
      date: `${year}-${month}-${day}`,
      description: "",
      amount: "",
    });
    setIndexNum(null);

    RowStyle(indexNum, "", false);
  };

  useEffect(() => {
    Login[1]();
    FilterRows[1]({
      itemVal: "",
      searchVal: "",
      prevItem: "",
      prevSearch: "",
    });
    setUpdateData([]);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      purchaseData.length === 0 &&
      sellData.length === 0 &&
      expenseData.length === 0
    ) {
      GetOneData(
        `${expenseApi}/getData`,
        (data) => {
          const filterData = filterPageType(data, Login[0]);

          setExpenseData(filterData);
          updateStates(filterData);
        },
        load
      );
    } else {
      setExpenseData(expenseData);
      updateStates(expenseData);
    }
    // eslint-disable-next-line
  }, [Login[0].adminPath]);

  const totalShortCut = (res) => {
    const getDesc = res.map((elm) => elm.description);
    const getAmount = res.map((elm) => elm.amount);
    setTotal({
      descriptions: getDesc.length,
      amount: SumNumberArray(getAmount),
    });
  };

  const SaveData = (state, getData) => {
    const newData = [...data, getData];
    state((prev) => [...prev, getData]);
    updateStates(newData);
    ResetData();
  };
  const UpdateData = (state, setState, getData) => {
    const filterData = state.map((elm) => {
      if (elm._id === getData._id) {
        return getData;
      }
      return elm;
    });

    setState(filterData);
    updateStates(filterData);
    ResetData();
  };

  const FormSubmit = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const newDate = generateShortDate(date);
    const newHisDate = generateNewDateTime();

    const sendData = {
      ...inputData,
      date: newDate,
      pageType: Login[0].adminPath,
      delId: "",
    };

    if (indexNum && updateData.length > 0) {
      UpdateData(expenseData, setExpenseData, inputData);
      toast.success("Expense Updated Successfully.");
      setUpdateData([]);

      const filterData = data.find((elm) => elm._id === indexNum);
      const randomID = `${Math.random() + Math.random()}${new Date()
        .getTime()
        .toString()}`;

      const historyData = {
        _id: Login[0].id + "exp",
        userType: Login[0].type,
        username: Login[0].user,
        path: Login[0].path,
        pageName: "Expense List",
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

      axios
        .put(`${expenseApi}/updateData/${indexNum}`, sendData, {
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
                setExpenseData(data);
                updateStates(data);
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
          setExpenseData(data);
          updateStates(data);

          if (err.stack.includes("Network Error"))
            ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else if (!indexNum && updateData.length === 0) {
      SaveData(setExpenseData, sendData);
      toast.success("Expense Saved Successfully.");

      axios
        .post(`${expenseApi}/saveData`, sendData, {
          headers: { "auth-token": authToken },
        })
        .catch((err) => {
          setLoading(false);
          setExpenseData(data);
          updateStates(data);

          if (err.stack.includes("Network Error"))
            ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else {
      ModalDialog.info(
        "Information",
        "Record did't update because there was no changes!"
      );
    }
  };

  return Login[0].path === path || Login[0].path === "all" ? (
    <>
      <h1 className="text-center mt-4">
        {pagePath ? "Afghan Land" : "Stock Market"} Expenses
      </h1>

      <div className="container-fluid mt-4 allPurchaseCon">
        <div className="row mt-5 justify-content-center mt-5">
          <div className="col-11 col-lg-12 px-0 px-lg-5">
            <form
              className="row gy-4 gx-5 justify-content-center justify-content-sm-start justify-content-xl-center"
              onSubmit={FormSubmit}
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

              <div className={`${inputCol} col-xxl-3`}>
                <label className="form-label">Description:</label>
                <input
                  autoFocus
                  autoComplete="off"
                  type="text"
                  name="description"
                  value={description}
                  onChange={ChangeInputs}
                  className="form-control"
                  required
                />
              </div>

              <div className={inputCol}>
                <label className="form-label">Amount:</label>
                <input
                  type="number"
                  min={1}
                  name="amount"
                  value={amount}
                  onChange={ChangeInputs}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 col-xl-5 col-xxl-4">
                <div className="row gy-3 mt-0 mt-sm-4 justify-content-center justify-content-xxl-start">
                  <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                    <Button
                      disabled={load}
                      type="submit"
                      className={`formBtn ${
                        indexNum ? "updateBtn" : "saveBtn"
                      }`}
                    >
                      {indexNum ? "Update" : "Save"}
                    </Button>
                  </div>

                  <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                    <Button
                      className="formBtn saveBtn"
                      onClick={() => {
                        ResetData();
                        setUpdateData([]);
                      }}
                    >
                      {indexNum ? "Cancel" : "Reset"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-12 col-lg-11 mt-5 pt-5">
            <ExpenseGrid
              Data={[data, setData]}
              IndexNum={[indexNum, setIndexNum]}
              Total={[total, setTotal]}
              {...{
                FilterRows,
                apiName: expenseApi,
                load,
                Login,
                DeleteObj: DeleteObj,
                PrevInput,
                updateStates,
                setExpenseData,
                filterData,
                GetOneData,
                ResetData,
                setInputData,
                totalShortCut,
                setLoading,
              }}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default AfghanLandExpense;
