import React from "react";
import { Button } from "@mui/material";
import Login from "../Images/login.jpg";
import { translatePage } from "../Functions/Functions";

const ChooseAccount = ({ inputProps, PasswordPage }) => {
  return (
    <>
      <form
        className="chooseAct"
        style={{
          transform: "translateX(60rem)",
          opacity: "0",
          display: "none",
        }}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Choose Account</h2>

        <Button
          className="btn"
          onClick={() => PasswordPage("editAct", "chooseAct")}
        >
          Edit Account
        </Button>
        <Button
          className="btn"
          onClick={() => PasswordPage("deleteAct", "chooseAct")}
        >
          Delete Account
        </Button>

        <h5
          onClick={() => {
            translatePage("loginForm", "X", "chooseAct", "X", "60");
            inputProps[2]();
            inputProps[3]("remove");
          }}
        >
          Back to Login
        </h5>
      </form>
    </>
  );
};

export default ChooseAccount;
