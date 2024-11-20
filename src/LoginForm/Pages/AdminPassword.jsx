import React, { useContext, useState } from "react";
import { Button } from "@material-ui/core";
import { FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import CreateInput from "../CreateInput";
import SimpleLoad from "../../UI/SimpleLoad";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const AdminPassword = ({
  inputProps,
  load,
  setBtnLoad,
  loadRegisterData,
  setEditData,
  loadUsers,
  LoginItems,
  AdminLoginAPI,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setBtnLoad(true);
      const response = await axios.get(AdminLoginAPI);
      const getpassword = response.data.find(
        (elm) => elm.partThree === "success"
      );

      if (password === getpassword.partTwo) {
        if (LoginItems[0].linkName === "deleteAct") {
          loadUsers(response.data, false);
          translatePage("deleteAcc", "X", "adminPass", "Y", "-60");
          LoginItems[1]((prev) => ({
            ...prev,
            info: "Select an account to Delete.",
          }));
        } else if (LoginItems[0].linkName === "editAct") {
          setEditData(response.data);
          translatePage("editAcc", "X", "adminPass", "Y", "-60");
          LoginItems[1]((prev) => ({
            ...prev,
            info: "You can change every Account with current Username.",
          }));
        } else if (LoginItems[0].linkName === "register") {
          loadRegisterData();
          if (!load) {
            translatePage("registerForm", "X", "adminPass", "Y", "-60");
            LoginItems[1]((prev) => ({
              ...prev,
              info: "Create a new user Account.",
            }));
          }
        } else if (LoginItems[0].linkName === "viewUsers") {
          loadUsers(response.data, true);
          document.getElementById("userBox").style.transform = "translateY(0)";
        }

        setPassword("");
      } else {
        setPassword("");
        ModalDialog.error("Error", "Invalid Admin Password");
      }
      setBtnLoad(false);
    } catch (err) {
      setBtnLoad(false);
      ModalDialog.error("Network Error", "Can't connect to Server");
    }
  };

  return (
    <>
      <form
        className="adminPass"
        style={{
          transform: "translateY(-60rem)",
          opacity: "0",
          display: "none",
        }}
        onSubmit={handleSubmit}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Admin Password</h2>
        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <Button type="submit" className="btn" disabled={load}>
          {load ? (
            <>
              <span className="me-4">verifying</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "OK"
          )}
        </Button>
        {!load && (
          <h5
            onClick={() => {
              setPassword("");
              translatePage("loginForm", "X", "adminPass", "Y", "-60");
              inputProps[2]();
            }}
          >
            Back to Login
          </h5>
        )}
      </form>
    </>
  );
};

export default AdminPassword;
