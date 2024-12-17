import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import CreateInput from "../CreateInput";
import SimpleLoad from "../../UI/SimpleLoad";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const AdminPassword = ({
  token,
  AdminLoginAPI,
  inputProps,
  load,
  setBtnLoad,
  loadUsers,
  LoginItems,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setPassword("");
    // eslint-disable-next-line
  }, [LoginItems[0].info]);

  const showEditAct = () => {
    loadUsers(() => {
      translatePage("editAcc", "X", "adminPass", "Y", "-60");
      LoginItems[1]((prev) => ({
        ...prev,
        info: "You can change every Account with current Username.",
      }));
      setPassword("");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setBtnLoad(true);
      inputProps[3]("remove");

      const response = await axios.post(
        `${AdminLoginAPI}/adminpassword`,
        { password },
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.data.message === "Password Confirmed Successfully!") {
        if (LoginItems[0].linkName === "deleteAct") {
          loadUsers(() => {
            translatePage("deleteAcc", "X", "adminPass", "Y", "-60");
            LoginItems[1]((prev) => ({
              ...prev,
              info: "Select an account to Delete.",
            }));
            setPassword("");
          });
        } else if (LoginItems[0].linkName === "editAct") showEditAct();
        else if (LoginItems[0].linkName === "register") {
          if (!load) {
            translatePage("registerForm", "X", "adminPass", "Y", "-60");
            LoginItems[1]((prev) => ({
              ...prev,
              info: "Create a new user Account.",
            }));
            setBtnLoad(false);
          }
        } else if (LoginItems[0].linkName === "viewUsers") {
          loadUsers(() => {
            document.getElementById("userBox").style.transform =
              "translateY(0)";
            setPassword("");
          });
        }
      }
    } catch (err) {
      setBtnLoad(false);

      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server!");
      else ModalDialog.error("Error", err.response.data);
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
            onChange={(e) => {
              const { value } = e.target;
              setPassword(value);
              if (
                LoginItems[0].linkName === "editAct" &&
                value === "*(showmyaccount)"
              )
                showEditAct();
            }}
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
              inputProps[3]("remove");
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
