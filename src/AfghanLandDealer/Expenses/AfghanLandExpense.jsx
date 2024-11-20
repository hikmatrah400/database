import React, { useContext, useEffect, useState } from "react";
import NoPageFound from "../../NoPageFound/NoPageFound";
import { Button } from "@material-ui/core";
import ExpenseGrid from "./ExpenseGrid";
import axios from "axios";
import { toast } from "react-toastify";
import { RowStyle, SumNumberArray } from "../../Functions/Functions";
import { expensesApi, historyApi, stockExpenseApi } from "../../Apis";
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
  ItemValue,
  SearchValue,
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
    id: randomID,
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
    const randomID = `${Math.random() + Math.random()}${new Date()
      .getTime()
      .toString()}`;
    setInputData({
      id: randomID,
      date: `${year}-${month}-${day}`,
      description: "",
      amount: "",
    });
    setIndexNum(null);

    RowStyle(indexNum, "", false);
  };

  useEffect(() => {
    Login[1]();
    ItemValue[1]("");
    SearchValue[1]("");
    setUpdateData([]);

    if (
      purchaseData.length === 0 &&
      sellData.length === 0 &&
      expenseData.length === 0
    ) {
      GetOneData(
        pagePath ? expensesApi : stockExpenseApi,
        (data) => {
          setExpenseData(data);
          updateStates(data);
        },
        load
      );
    } else {
      setExpenseData(expenseData);
      updateStates(expenseData);
    }

    // eslint-disable-next-line
  }, []);

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
      if (elm.id === getData.id) {
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
    const month = new Date(date).toLocaleString("en-Us", { month: "short" });
    const year = new Date(date).getFullYear();
    const day = new Date(date).toLocaleString("en-Us", { day: "2-digit" });
    const newDay = Number(day) + 1;

    const hMonth = new Date().toLocaleString("en-Us", { month: "short" });
    const hYear = new Date().getFullYear();
    const hDay = new Date().toLocaleString("en-Us", { day: "2-digit" });

    const sendData = {
      ...inputData,
      date: `${month}-${newDay < 9 ? `0${newDay}` : newDay}-${year}`,
      delId: "",
    };

    if (indexNum && updateData.length > 0) {
      UpdateData(expenseData, setExpenseData, inputData);
      toast.success("Expense Updated Successfully.");
      setUpdateData([]);

      const filterData = data.filter((elm) => elm.id === indexNum);
      const randomID = `${Math.random() + Math.random() + Math.random()}`;

      const historyData = {
        id: randomID,
        userType: Login[0].type,
        username: Login[0].user,
        path: Login[0].path,
        pageName: "Expense List",
        delId: "",
        rowType: "updated",

        history: [
          {
            ...sendData,
            id: randomID,
            star: false,
            view: false,
            rowType: "updated",
            modifyed: `${hMonth}-${hDay}-${hYear} | ${new Date().toLocaleTimeString()}`,
            prevData: filterData,
          },
        ],
      };

      axios
        .put(
          `${pagePath ? expensesApi : stockExpenseApi}/${indexNum}`,
          sendData
        )
        .then(() => {
          if (Login[0].path !== "all") {
            axios.post(historyApi, historyData).catch(() => {
              setLoading(false);
              setExpenseData(data);
              updateStates(data);
              ModalDialog.error("Network Error", "Can't Connect to Server!");
            });
          }
        })
        .catch(() => {
          setLoading(false);
          setExpenseData(data);
          updateStates(data);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else if (!indexNum && updateData.length === 0) {
      SaveData(setExpenseData, sendData);
      toast.success("Expense Saved Successfully.");

      axios
        .post(pagePath ? expensesApi : stockExpenseApi, sendData)
        .catch(() => {
          setLoading(false);
          setExpenseData(data);
          updateStates(data);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else {
      ModalDialog.info(
        "Information",
        "Record did't update because there was no changes!"
      );
    }
  };

  return Login[0].userCode === Login[0].prevCode &&
    (Login[0].path === path || Login[0].path === "all") ? (
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
                ItemValue,
                SearchValue,
                apiName: pagePath ? expensesApi : stockExpenseApi,
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
