import React, { useContext, useEffect, useState } from "react";
import "./Styles/LoginForm.scss";
import axios from "axios";

import Wave from "./Images/wave.png";
import AdminLogin from "./Pages/AdminLogin";
import Register from "./Pages/Register";
import AdminPassword from "./Pages/AdminPassword";
import ChooseAccount from "./Pages/ChooseAccount";
import EditAccount from "./Pages/EditAccount";
import DeleteAccount from "./Pages/DeleteAccount";
import Greeting from "./Pages/Greeting";
import SelectPage from "./Pages/SelectPage";
import ViewUsers from "./Pages/ViewUsers";
import { translatePage } from "./Functions/Functions";
import ShowDialog from "../UI/BsModalDialog/BsModalDialog";
import { useNavigate } from "react-router-dom";

const LoginForm = ({
  AdminLoginAPI,
  lockDatabaseApi,
  SimpleLoad,
  setLogin,
  databaseCode,
  Loading,
}) => {
  const navigate = useNavigate();
  const ModalDialog = useContext(ShowDialog);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDljMzQ4YWRmMDVkYWI4YTVmYzEyZSIsImlhdCI6MTczMjg5MTA3Mn0.wM6bajrfdAaPcApWZn_ExJvCL_0eDKBwwsfc3IjUOQ8";

  //Users---
  const [users, setUsers] = useState([]);

  //Dialog--
  const [dialogOpen, setDialogOpen] = useState(false);

  const [loginItems, setLoginItems] = useState({
    linkName: "",
    info: "to Our Database. Please Enter username and password to Login.",
  });
  const [loading, setLoading] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);

  const inputFocus = (e) => {
    const inputBox = e.target.parentElement;
    inputBox.classList.add("focus");
  };
  const inputLeave = (e) => {
    const inputBox = e.target.parentElement;
    if (e.target.value === "") inputBox.classList.remove("focus");
  };

  const clearAllInputFocus = (value) => {
    const inputBox = document.getElementsByClassName("input_box");
    for (let i = 0; i < inputBox.length; i++) {
      inputBox[i].classList[value]("focus");
    }
  };

  const backToLogin = () =>
    setLoginItems((prev) => ({
      ...prev,
      info: "to Our Database. Please Enter username and password to Login.",
    }));

  const inputProps = [inputFocus, inputLeave, backToLogin, clearAllInputFocus];
  const LoginItems = [loginItems, setLoginItems];

  const ChangeInputs = (e, state) => {
    const { name, value } = e.target;
    state((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const loadUsers = async (method) => {
    try {
      const response = await axios.get(`${AdminLoginAPI}/register`);
      setUsers(response.data);
      setBtnLoad(false);
      if (method) method();
    } catch (err) {
      setBtnLoad(false);
      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server");
      else ModalDialog.error("Login Failed", err.response.data);
    }
  };

  const loadLoginedUser = async () => {
    try {
      const getToken = localStorage.getItem("authToken");

      if (getToken) {
        setPageLoad(true);
        const response = await axios.get(`${AdminLoginAPI}/verifyToken`, {
          headers: { "auth-token": getToken },
        });
        const { nvigateType, nvigateTo } = response.data.userData;
        setPageLoad(response.data.load);

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
          navigate("/deliveryCargo/");
        } else if (nvigateTo === "all") {
          translatePage("selectPage", "Y", "loginForm", "X", "-60");
        } else navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
      setPageLoad(false);
      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server");
    }
  };

  useEffect(() => {
    loadLoginedUser();
    setLogin((prev) => ({ ...prev, user: "" }));
    // eslint-disable-next-line
  }, []);

  const PasswordPage = (linkValue, outValue) => {
    translatePage("adminPass", "Y", outValue, "X", "-60");
    LoginItems[1]({
      linkName: linkValue,
      info: "Please enter Admin current Password",
    });
  };

  const PageProp = {
    token,
    LoginItems,
    inputProps,
    pageLoad: loading,
    load: btnLoad,
    SimpleLoad,
    setBtnLoad,
    setLoading,
    AdminLoginAPI,
    ChangeInputs,
    PasswordPage,
  };

  // Copy this code to App.js

  // import { ToastContainer } from "react-toastify";
  // import "react-toastify/dist/ReactToastify.css";

  // const [showDatabase, setShowDatabase] = useState(true);
  // const databaseCode = "*#$lockdatabase$#*";
  // const [login, setLogin] = useState({
  //   user: "",
  //   adminPath: "",
  //   badgeColor: "",
  //   path: "",
  //   type: "",
  // });

  // const GetLogin = async () => {
  //   try {
  //     const getToken = localStorage.getItem("authToken");
  //     if (login.user === "") setLoading(true);

  //     if (getToken) {
  //       const response = await axios.get(`${accountLoginApi}/verifyToken`, {
  //         headers: { "auth-token": getToken },
  //       });
  //       const { username, nvigateTo, nvigateType, badgeColor } =
  //         response.data.userData;

  //       setLogin({
  //         user: username,
  //         adminPath: location.pathname.includes("afghanAndDealer")
  //           ? "afghanAndDealer"
  //           : location.pathname.includes("stockMarket")
  //           ? "stockMarket"
  //           : "",
  //         badgeColor: badgeColor,
  //         path: nvigateTo,
  //         type: nvigateType,
  //       });

  //       setLoading(response.data.load);
  //     } else {
  //       setLogin((prev) => ({ ...prev, user: "" }));
  //       setLoading(false);
  //       navigate("/");
  //     }
  //   } catch (err) {
  //     navigate("/");
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Loading
        open={pageLoad}
        background="#fff"
        circleColor="#1a73e8"
        color="#000"
        text="Please Wait... Server is Starting..."
      />

      <div className="allLoginContainer">
        <div className="row justify-content-center justify-content-lg-between">
          <div className="col-md-4 col-lg-3 d-none d-lg-block">
            <img
              src={Wave}
              className="login_wave"
              alt="browser did't support this img"
            />
            <h1 className="greeting">
              <Greeting />
            </h1>

            <div className="content_container">
              <div className="content">
                <h2>Welcome</h2>
                <section>{loginItems.info}</section>
              </div>
            </div>
          </div>

          <div
            className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-7 col-xxl-6 me-0 me-xxl-5 mediaContainer"
            style={{ padding: "0 18rem" }}
          >
            <div className="login_container">
              <div className="main_container">
                <AdminLogin
                  {...{
                    lockDatabaseApi,
                    databaseCode,
                    ...PageProp,
                  }}
                />

                <Register
                  {...{
                    DialogOpen: [dialogOpen, setDialogOpen],
                    loginItems,
                    loadUsers,
                    ...PageProp,
                  }}
                />
                <AdminPassword
                  {...{
                    loadUsers,
                    ...PageProp,
                  }}
                />
                <ChooseAccount {...{ inputProps, PasswordPage }} />
                <EditAccount
                  {...{
                    users,
                    DialogOpen: [dialogOpen, setDialogOpen],
                    loginItems,
                    loadUsers,
                    ...PageProp,
                  }}
                />
                <DeleteAccount
                  {...{
                    loadUsers,
                    setLoading,
                    users,
                    ...PageProp,
                  }}
                />
                <SelectPage setLogin={setLogin} inputProps={inputProps} />
              </div>
            </div>
          </div>
        </div>

        <div className="content_media_container d-flex d-lg-none">
          <div className="content">
            <h2>Welcome</h2>
            <section>{loginItems.info}</section>

            <h1 className="greeting mediaGreet d-block d-lg-none">
              <Greeting />
            </h1>
          </div>
        </div>
      </div>

      <ViewUsers
        {...{
          load: btnLoad,
          inputProps,
          viewUsers: users,
        }}
      />
    </>
  );
};

export default LoginForm;
