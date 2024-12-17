import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { Button } from "@mui/material";
import { translatePage } from "../Functions/Functions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateInput from "../CreateInput";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const AdminLogin = ({
  AdminLoginAPI,
  lockDatabaseApi,
  SimpleLoad,
  load,
  pageLoad,
  inputProps,
  LoginItems,
  setLoading,
  setBtnLoad,
  ChangeInputs,
  databaseCode,
  PasswordPage,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const navigate = useNavigate();

  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const { username, password } = loginValues;

  useEffect(() => {
    setLoginValues({
      username: "",
      password: "",
    });
    // eslint-disable-next-line
  }, [LoginItems[0]]);

  const lockDatabase = () => {
    if (window.confirm("Would you like to Lock this Database?")) {
      const msg = prompt("Enter your message");

      if (msg) {
        setLoading(true);
        axios
          .put(
            `${lockDatabaseApi}/lock/10203040`,
            {
              message: msg,
            },
            {
              headers: {
                "auth-token":
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibG9ja2RhdGFiYXNlIENvZGUhIiwiaWF0IjoxNzMzNDI2NDI0fQ.1jJpKp6uLk6m1yQVcTQP0bxRaahoVyqjyxNdxr7CXEE",
              },
            }
          )
          .then(() => {
            ModalDialog.success("Locked", "Database has been Locked.");
            setLoading(false);
          })
          .catch((err) => {
            if (err.stack.includes("Network Error"))
              ModalDialog.error("Network Error", "Can't Connect to Server");
            else ModalDialog.error("Login Failed", err.response.data);
            setLoading(false);
          });
      }
    }
  };

  const SubmitForm = async (e) => {
    e.preventDefault();

    setBtnLoad(true);
    try {
      const response = await axios.post(`${AdminLoginAPI}/login`, loginValues);
      const { nvigateTo, nvigateType, authToken, user } = response.data;

      localStorage.setItem("user", user);
      localStorage.setItem("authToken", authToken);

      if (nvigateTo === "afghanAndDealer") {
        navigate(
          `/afghanAndDealer/${
            nvigateType === "Purchaser" ? "purchaseList" : "sellList"
          }`
        );
      } else if (nvigateTo === "stockMarket") {
        navigate(
          `/stockMarket/${
            nvigateType === "Purchaser" ? "purchaseList" : "sellList"
          }`
        );
      } else if (nvigateTo === "Tek Delivery Service(Cargo)") {
        if (!load) navigate("/deliveryCargo/");
      } else if (nvigateTo === "all") {
        if (!load) translatePage("selectPage", "Y", "loginForm", "X", "-60");
      } else navigate("/");

      setLoginValues({ username: "", password: "" });
      setBtnLoad(false);
    } catch (err) {
      setBtnLoad(false);
      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server!");
      else ModalDialog.error("Login Failed", err.response.data);
    }
  };

  return (
    <>
      <form
        className="loginForm"
        style={{
          transform: "translateX(0rem)",
          opacity: "1",
          display: "block",
        }}
        onSubmit={SubmitForm}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Login</h2>

        <div className="input_box">
          <CreateInput
            label="Username"
            type="text"
            value={username}
            name="username"
            onChange={(e) => ChangeInputs(e, setLoginValues)}
            inputProps={inputProps}
            icon={FaUser}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => {
              ChangeInputs(e, setLoginValues);
              if (e.target.value === databaseCode) lockDatabase();
            }}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <Button type="submit" className="btn" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Signing</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Login"
          )}
        </Button>

        <div className="row justify-content-evenly">
          {!load && (
            <>
              <div className="col-4 col-sm-3">
                <h5
                  onClick={() => {
                    translatePage("chooseAct", "X", "loginForm", "X", "-60");
                    LoginItems[1]({
                      linkName: "accounts",
                      info: "Choose Account for Editing",
                    });
                    inputProps[3]("remove");
                  }}
                >
                  Accounts
                </h5>
              </div>

              <div className="col-6 col-sm-5">
                <h5
                  onClick={() => {
                    PasswordPage("register", "loginForm");
                    inputProps[3]("remove");
                  }}
                >
                  New Registration
                </h5>
              </div>

              <div className="col-4 col-sm-3">
                <h5
                  onClick={() => {
                    PasswordPage("viewUsers", "loginForm");
                    inputProps[3]("remove");
                  }}
                >
                  View Users
                </h5>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default AdminLogin;
