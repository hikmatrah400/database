import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

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

const LoginForm = ({
  AdminLoginAPI,
  SimpleLoad,
  notLoginAPI,
  setLogin,
  databaseCode,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [data, setData] = useState([]);

  //editACT----
  const [editData, setEditData] = useState([]);

  //deleteACt---
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  //viewACt---
  const [viewUsers, setViewUsers] = useState([]);

  //Register--
  const [registerData, setRegisterData] = useState([]);

  //Dialog--
  const [dialogOpen, setDialogOpen] = useState(false);

  const [loginItems, setLoginItems] = useState({
    linkName: "",
    info: "to Our Database. Please Enter username and password to Login.",
  });
  const [loading, setLoading] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [showLoginLoad, setShowLoginLoad] = useState(false);

  const inputFocus = (e) => {
    const inputBox = e.target.parentElement;
    inputBox.classList.add("focus");
  };
  const inputLeave = (e) => {
    const inputBox = e.target.parentElement;
    if (e.target.value === "") inputBox.classList.remove("focus");
  };

  const backToLogin = () =>
    setLoginItems((prev) => ({
      ...prev,
      info: "to Our Database. Please Enter username and password to Login.",
    }));

  const inputProps = [inputFocus, inputLeave, backToLogin];
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

  const loadPartThree = (data) =>
    data.filter((elm) => elm.partThree === "failed");

  const loadUsers = async (data = [], viewUser) => {
    try {
      if (data.length === 0) {
        setBtnLoad(true);
        setLoading(true);

        const response = await axios.get(AdminLoginAPI);
        const getUsers = loadPartThree(response.data);
        setAllUsers(response.data);
        setUsers(getUsers);

        setBtnLoad(false);
        setLoading(false);
      } else {
        const getUsers = loadPartThree(data);

        if (viewUser) setViewUsers(data);
        else {
          setAllUsers(data);
          setUsers(getUsers);
        }
      }
    } catch (err) {
      setBtnLoad(false);
      setLoading(false);
      ModalDialog.error("Network Error", "Can't connect to Server!");
    }
  };

  const loadRegisterData = async () => {
    try {
      setBtnLoad(true);
      const response = await axios.get(AdminLoginAPI);
      setRegisterData(response.data);
      setBtnLoad(false);
    } catch (err) {
      setBtnLoad(false);
    }
  };

  const loadData = async () => {
    try {
      setShowLoginLoad(true);
      const response = await axios.get(notLoginAPI);
      setData(response.data);
      setShowLoginLoad(false);
    } catch (error) {
      setShowLoginLoad(false);
      ModalDialog.error("Network Error", "Can't connect to Server!");
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("partOne");
    sessionStorage.removeItem("partTwo");
    setLogin({
      user: "",
      prevCode: "",
      userCode: "",
      adminPath: "",
      badgeColor: "",
      path: "",
      type: "",
    });
    loadData();

    // eslint-disable-next-line
  }, []);

  const UpdateLogin = async (code, user, path) => {
    setLoading(true);

    const filterUser = data.find((elm) => elm.partOne === user);
    if (filterUser !== undefined) {
      axios
        .put(`${notLoginAPI}/${filterUser.id}`, {
          partOne: filterUser.partOne,
          userCode: code,
          path: path,
          badgeColor: filterUser.badgeColor,
          nvigateType: filterUser.nvigateType,
        })
        .then(() => setLoading(false))
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!", "OK");
        });
    }
  };

  const PasswordPage = (linkValue, outValue) => {
    translatePage("adminPass", "Y", outValue, "X", "-60");
    LoginItems[1]({
      linkName: linkValue,
      info: "Please enter Admin current Password",
    });
  };

  const PageProp = {
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
  //   prevCode: "",
  //   userCode: "",
  //   adminPath: "",
  //   badgeColor: "",
  //   path: "",
  //   type: "",
  // });

  // const GetLogin = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(notLoginApi);

  //     const getUser = sessionStorage.getItem("partOne");
  //     const getCode = sessionStorage.getItem("partTwo");
  //     const filterUser = response.data.find((elm) => elm.partOne === getUser);

  //     setLogin({
  //       user: filterUser.partOne,
  //       prevCode: getCode,
  //       userCode: filterUser.userCode,
  //       adminPath: location.pathname.includes("afghanAndDealer")
  //         ? "afghanAndDealer"
  //         : location.pathname.includes("stockMarket")
  //         ? "stockMarket"
  //         : "",
  //       badgeColor: filterUser.badgeColor,
  //       path: filterUser.path,
  //       type: filterUser.nvigateType,
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  return (
    <>
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
                    UpdateLogin,
                    databaseCode,
                    showLoginLoad,
                    loginData: data,
                    loadData,
                    ...PageProp,
                  }}
                />

                <Register
                  {...{
                    registerData,
                    notLoginAPI,
                    DialogOpen: [dialogOpen, setDialogOpen],
                    loginItems,
                    loadData,
                    ...PageProp,
                  }}
                />
                <AdminPassword
                  {...{
                    loadRegisterData,
                    setEditData,
                    loadUsers,
                    ...PageProp,
                  }}
                />
                <ChooseAccount {...{ inputProps, PasswordPage }} />
                <EditAccount
                  {...{
                    editData,
                    DialogOpen: [dialogOpen, setDialogOpen],
                    notLoginAPI,
                    loginItems,
                    loadData,
                    ...PageProp,
                  }}
                />
                <DeleteAccount
                  {...{
                    loadUsers,
                    setLoading,
                    users,
                    allUsers,
                    notLoginAPI,
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
          load: loading,
          inputProps,
          viewUsers,
        }}
      />
    </>
  );
};

LoginForm.propTypes = {
  AdminLoginAPI: PropTypes.string.isRequired,
  SimpleLoad: PropTypes.func.isRequired,
};

export default LoginForm;
