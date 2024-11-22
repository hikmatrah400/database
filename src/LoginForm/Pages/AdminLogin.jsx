import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminLoginApi, notLoginApi } from "../../Apis";
import CreateInput from "../CreateInput";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const AdminLogin = ({
  SimpleLoad,
  load,
  showLoginLoad,
  pageLoad,
  inputProps,
  LoginItems,
  setLoading,
  setBtnLoad,
  AdminLoginAPI,
  ChangeInputs,
  UpdateLogin,
  databaseCode,
  loadData,
  loginData,
  PasswordPage,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const navigate = useNavigate();

  const [code, setCode] = useState(0);
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const { username, password } = loginValues;

  const getPassword = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${adminLoginApi}/1`);
      alert(`Username: ${res.data.partOne} \n Password: ${res.data.partTwo}`);
      setLoginValues({ username: "", password: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const lockDatabase = () => {
    if (window.confirm("Would you like to Lock this Database?")) {
      const msg = prompt("Enter your message");
      if (msg !== null) {
        setLoading(true);
        axios
          .put(`${notLoginApi}/10203040`, {
            database: false,
            message: msg,
          })
          .then(() => {
            ModalDialog.success("Locked", "Database has been Locked.");
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const randomCode = (text) => text[Math.floor(Math.random() * text.length)];
  useEffect(() => {
    var text =
      `abcdefg${Math.random()}hijklmno${Math.random()}pqrstuvwxyz1234567890`.split(
        ""
      );
    let code = 0;
    for (let i = 0; i < 40; i++) {
      code = code + randomCode(text);
    }

    setCode(code);
    // eslint-disable-next-line
  }, []);

  const showError = () => {
    ModalDialog.error("Login Failed", "Wrong Username or Password!", "OK");
    setBtnLoad(false);
  };

  const SubmitForm = async (e) => {
    e.preventDefault();

    setBtnLoad(true);
    try {
      const response = await axios.get(AdminLoginAPI);
      const getUsers = response.data.find((elm) => elm.partOne === username);

      if (getUsers === undefined) showError();
      else if (username === getUsers.partOne && password === getUsers.partTwo) {
        if (code !== 0) {
          sessionStorage.setItem("partOne", username);
          sessionStorage.setItem("partTwo", code);

          if (getUsers.nvigateTo === "Afghan Land & Dealer") {
            UpdateLogin(code, username, "afghanAndDealer");
            setTimeout(() => {
              navigate(
                `/afghanAndDealer/${
                  getUsers.nvigateType === "Purchaser"
                    ? "purchaseList"
                    : "sellList"
                }`
              );
            }, 300);
          } else if (getUsers.nvigateTo === "Stock Market Shop") {
            UpdateLogin(code, username, "stockMarket");
            setTimeout(() => {
              navigate(
                `/stockMarket/${
                  getUsers.nvigateType === "Purchaser"
                    ? "purchaseList"
                    : "sellList"
                }`
              );
            }, 300);
          } else if (getUsers.nvigateTo === "Tek Delivery Service(Cargo)") {
            UpdateLogin(code, username, "deliveryCargo");
            if (!load) navigate("/deliveryCargo/");
          } else if (getUsers.nvigateTo === "all") {
            UpdateLogin(code, username, "all");
            if (!load)
              translatePage("selectPage", "Y", "loginForm", "X", "-60");
          } else navigate("/");

          setLoginValues({ username: "", password: "" });
          setBtnLoad(false);
        }
      } else showError();
    } catch (err) {
      setBtnLoad(false);
      ModalDialog.error("Network Error", "Can't connect to Server!", "OK");
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
        {showLoginLoad ? (
          <div>
            <SimpleLoad size={55} />
            <h3 className="mt-5">Just a moment ...</h3>
          </div>
        ) : loginData.length === 0 ? (
          <div>
            <h3 className="mt-5" style={{ fontSize: "2.5rem" }}>
              Can't Connect to Server!
            </h3>
            <Button className="btn mt-5" onClick={loadData}>
              Reload Data
            </Button>
          </div>
        ) : (
          <>
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
                  if (e.target.value === "*(showmyaccount)") getPassword();
                  else if (e.target.value === databaseCode) lockDatabase();
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
                        translatePage(
                          "chooseAct",
                          "X",
                          "loginForm",
                          "X",
                          "-60"
                        );
                        LoginItems[1]({
                          linkName: "accounts",
                          info: "Choose Account for Editing",
                        });
                      }}
                    >
                      Accounts
                    </h5>
                  </div>

                  <div className="col-6 col-sm-5">
                    <h5 onClick={() => PasswordPage("register", "loginForm")}>
                      New Registration
                    </h5>
                  </div>

                  <div className="col-4 col-sm-3">
                    <h5 onClick={() => PasswordPage("viewUsers", "loginForm")}>
                      View Users
                    </h5>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default AdminLogin;
