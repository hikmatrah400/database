import React, { useContext, useState } from "react";
import {
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
} from "react-icons/fa";

import Login from "../Images/login.jpg";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import CreateInput from "../CreateInput";
import Dialog from "./Dialog";
import axios from "axios";
import { toast } from "react-toastify";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const EditAccount = ({
  load,
  pageLoad,
  SimpleLoad,
  setBtnLoad,
  inputProps,
  LoginItems,
  loginItems,
  DialogOpen,
  AdminLoginAPI,
  loadData,
  ChangeInputs,
  notLoginAPI,
  editData,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [username, setUsername] = useState("");

  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    newUser: "",
    newPass: "",
    confirmPass: "",
  });
  const { fullName, phone, email, newUser, newPass, confirmPass } = values;

  const ResetData = () => {
    setValues({
      fullName: "",
      phone: "",
      email: "",
      newUser: "",
      newPass: "",
      confirmPass: "",
    });
  };

  const navigateType = (value, type) =>
    value === "all"
      ? "all"
      : value === "Tek Delivery Service(Cargo)"
      ? "N/A"
      : type;

  const UpdateUserAct = (value, type) => {
    const badgeColors = [
      "#008e00",
      "#0066ff",
      "#9000ff",
      "#c20000",
      "#009dbc",
      "#bc7100",
    ];
    const newBadge =
      badgeColors[Math.floor(Math.random() * badgeColors.length)];

    axios
      .put(`${AdminLoginAPI}/${values.id}`, {
        fullName: values.fullName,
        email: values.email,
        phone: Number(values.phone),
        partOne: values.newUser,
        partTwo: values.newPass,
        partThree: values.partThree,
        nvigateTo: value,
        nvigateType: navigateType(value, type),
      })
      .then(() => {
        axios
          .put(`${notLoginAPI}/${values.id}`, {
            partOne: values.newUser,
            userCode: "No Match",
            path: "No Match",
            badgeColor: value === "all" ? "#1a73e8" : newBadge,
            nvigateType: navigateType(value, type),
          })
          .then(() => {
            loadData();
            ResetData();
            setUsername("");
            translatePage("loginForm", "X", "editAcc", "X", "-60");
            inputProps[2]();

            toast.success("Account Updated Successfully");
            setBtnLoad(false);
          })
          .catch(() => {
            setBtnLoad(false);
            ModalDialog.error("Network Error", "Can't connect to Server!");
          });
      })
      .catch(() => {
        setBtnLoad(false);
        ModalDialog.error("Network Error", "Can't connect to Server!");
      });
  };

  const findUsers = (value) => {
    const getName = editData.find((elm) => elm.partOne === value);

    if (getName !== undefined)
      setValues((prev) => ({
        ...prev,
        ...getName,
        newUser: getName.partOne,
        newPass: getName.partTwo,
        confirmPass: getName.partTwo,
      }));
    else
      setValues((prev) => ({
        ...prev,
        fullName: "",
        phone: "",
        email: "",
        newUser: "",
        newPass: "",
        confirmPass: "",
      }));
  };

  const SubmitForm = (e) => {
    e.preventDefault();
    const getName = editData.find((elm) => elm.partOne === username);
    const getAdmin = editData.find((elm) => elm.partThree === "success");

    if (getName === undefined) {
      ModalDialog.error("Failed", "Account Not Found");
    } else if (newPass !== confirmPass) {
      ModalDialog.error("Failed", "New Password was not Correctly Confirmed");
    } else if (getAdmin.partOne === username) UpdateUserAct("all", "all");
    else DialogOpen[1](true);
  };

  return (
    <>
      <form
        className="editAcc"
        style={{
          transform: "translateX(-60rem)",
          opacity: "0",
          display: "none",
        }}
        onSubmit={SubmitForm}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Edit Account</h2>

        <div className="input_box">
          <select
            className="input form-select shadow-none"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              findUsers(e.target.value);
            }}
            onFocus={inputProps[0]}
            onBlur={inputProps[1]}
            required
          >
            <option value="Choose...">Choose...</option>
            {editData
              .map((user) => user.partOne)
              .map((elm, ind) => {
                return (
                  <option key={ind} value={elm}>
                    {elm}
                  </option>
                );
              })}
          </select>
          <label>Current Username</label>

          <div className="i">
            <FaUser />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0">
              <CreateInput
                label="Full Name"
                type="text"
                value={fullName}
                name="fullName"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 mt-lg-0">
              <CreateInput
                label="Phone#"
                type="number"
                value={phone}
                name="phone"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaPhone}
              />
            </div>
          </div>
        </div>

        <div className="input_box">
          <CreateInput
            label="Email"
            type="email"
            value={email}
            name="email"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaEnvelope}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="New Username"
            type="text"
            value={newUser}
            name="newUser"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaUserPlus}
          />
        </div>

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0 m-lg-0">
              <CreateInput
                label="New Password"
                type="password"
                value={newPass}
                name="newPass"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 m-lg-0">
              <CreateInput
                label="Confirm Password"
                type="password"
                value={confirmPass}
                name="confirmPass"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="btn mt-5" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Updating</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Submit"
          )}
        </Button>

        <div className="d-flex justify-content-evenly">
          {!load && (
            <>
              <h5
                onClick={() => {
                  ResetData();
                  setUsername("");
                  translatePage("chooseAct", "X", "editAcc", "X", "-60");
                  LoginItems[1]({
                    linkName: "accounts",
                    info: "Please choose Account for editing",
                  });
                }}
              >
                Back
              </h5>

              <h5
                onClick={() => {
                  ResetData();
                  setUsername("");
                  translatePage("loginForm", "X", "editAcc", "X", "-60");
                  inputProps[2]();
                }}
              >
                Back to Login
              </h5>
            </>
          )}
        </div>
      </form>

      {loginItems.linkName === "editAct" && (
        <Dialog
          {...{
            page: false,
            values,
            notLoginAPI,
            UpdateUserAct,
            translatePage,
            inputProps,
            loadData,
            setBtnLoad,
            AdminLoginAPI,
            ModalDialog,
            ResetData,
            username,
          }}
          Open={DialogOpen}
        />
      )}
    </>
  );
};

export default EditAccount;
