import React, { useContext, useState } from "react";
import Login from "../Images/login.jpg";
import { FaLock, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { Button } from "@mui/material";
import { translatePage } from "../Functions/Functions";
import Dialog from "./Dialog";
import CreateInput from "../CreateInput";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const Register = ({
  pageLoad,
  load,
  token,
  loginItems,
  SimpleLoad,
  inputProps,
  setBtnLoad,
  DialogOpen,
  notLoginAPI,
  AdminLoginAPI,
  loadUsers,
  ChangeInputs,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const randomID = Math.random() + Math.random();
  const [values, setValues] = useState({
    id: randomID.toString(),
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPass: "",
    nvigateTo: "",
  });
  const { fullName, email, phone, username, password, confirmPass } = values;

  const SubmitForm = (e) => {
    e.preventDefault();

    if (password !== confirmPass)
      ModalDialog.error("Failed", "Password was not Correctly Confirmed!");
    else DialogOpen[1](true);
  };

  const ResetData = () => {
    const randomID = Math.random() + Math.random();

    setValues({
      id: randomID.toString(),
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPass: "",
      nvigateTo: "",
    });
    inputProps[3]("remove");
  };

  return (
    <>
      <form
        className="registerForm"
        style={{
          transform: "translateX(60rem)",
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
        <h2>Registration Form</h2>

        <div className="input_box">
          <CreateInput
            label="Full Name"
            type="text"
            value={fullName}
            name="fullName"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaUser}
          />
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

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0 m-lg-0">
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

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 m-lg-0">
              <CreateInput
                label="Username"
                type="text"
                value={username}
                name="username"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaUser}
              />
            </div>
          </div>
        </div>

        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <div className="input_box">
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

        <Button type="submit" className="btn" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Saving</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {!load && (
          <h5
            onClick={() => {
              translatePage("loginForm", "X", "registerForm", "X", "60");
              inputProps[2]();
              ResetData();
            }}
          >
            Back to Login
          </h5>
        )}
      </form>

      {loginItems.linkName === "register" && (
        <Dialog
          {...{
            page: true,
            token,
            values,
            notLoginAPI,
            translatePage,
            inputProps,
            setBtnLoad,
            AdminLoginAPI,
            loadUsers,
            ModalDialog,
            ResetData,
          }}
          Open={DialogOpen}
        />
      )}
    </>
  );
};

export default Register;
