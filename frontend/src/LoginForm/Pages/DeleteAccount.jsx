import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { Button } from "@mui/material";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import { toast } from "react-toastify";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const DeleteAccount = ({
  pageLoad,
  token,
  load,
  SimpleLoad,
  inputProps,
  LoginItems,
  AdminLoginAPI,
  users,
  loadUsers,
  setBtnLoad,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [username, setUsername] = useState("");

  const SubmitForm = (e) => {
    e.preventDefault();
    const getData = users.find((elm) => elm.username === username);

    if (username === "") ModalDialog.error("Failed", "Choose an Account!");
    else
      ModalDialog.success(
        "Please Confirm",
        "Would you like to Delete this Account?",
        "Yes/No",
        () => {
          axios
            .delete(`${AdminLoginAPI}/register/${getData._id}`, {
              headers: { "auth-token": token },
            })
            .then(() => {
              setUsername("");
              inputProps[3]("remove");
              loadUsers();
              toast.success("Account Deleted Successfully.");
            })
            .catch((err) => {
              setBtnLoad(false);

              if (err.stack.includes("Network Error"))
                ModalDialog.error("Network Error", "Can't Connect to Server!");
              else ModalDialog.error("Failed", err.response.data.message);
            });
        }
      );
  };

  const getUsers = users.filter((user) => user.partThree === "failed");

  return (
    <>
      <form
        className="deleteAcc"
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
        <h2>Delete Account</h2>

        <div className="input_box">
          <select
            className="input form-select shadow-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={inputProps[0]}
            onBlur={inputProps[1]}
            required
          >
            <option value="Choose...">
              {getUsers.length === 0 ? "No Account Found" : "Choose..."}
            </option>
            {getUsers.map((elm, ind) => {
              return (
                <option key={ind} value={elm.username}>
                  {elm.username}
                </option>
              );
            })}
          </select>
          <label>Account Name</label>

          <div className="i">
            <FaUser />
          </div>
        </div>

        <Button
          type="submit"
          className="btn"
          disabled={load || pageLoad || getUsers.length === 0}
        >
          {load ? (
            <>
              <span className="me-4">Deleting</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Delete Account"
          )}
        </Button>

        <div className="d-flex justify-content-evenly">
          {!load && (
            <>
              <h5
                onClick={() => {
                  translatePage("chooseAct", "X", "deleteAcc", "X", "-60");
                  LoginItems[1]({
                    linkName: "accounts",
                    info: "Please choose Account for editing",
                  });
                  inputProps[3]("remove");
                }}
              >
                Back
              </h5>

              <h5
                onClick={() => {
                  translatePage("loginForm", "X", "deleteAcc", "X", "-60");
                  inputProps[2]();
                  inputProps[3]("remove");
                }}
              >
                Back to Login
              </h5>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default DeleteAccount;
