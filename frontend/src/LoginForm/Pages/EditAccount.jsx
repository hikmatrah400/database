import React, { useContext, useState } from "react";
import {
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
} from "react-icons/fa";

import Login from "../Images/login.jpg";
import {
  Button,
  Checkbox,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { translatePage } from "../Functions/Functions";
import CreateInput from "../CreateInput";
import Dialog from "./Dialog";
import axios from "axios";
import { toast } from "react-toastify";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const EditAccount = ({
  load,
  token,
  pageLoad,
  SimpleLoad,
  setBtnLoad,
  inputProps,
  LoginItems,
  loginItems,
  DialogOpen,
  AdminLoginAPI,
  loadUsers,
  ChangeInputs,
  notLoginAPI,
  users,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [username, setUsername] = useState("");
  const [togglePass, setTogglePass] = useState(false);

  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    newUser: "",
    newPass: "",
    confirmPass: "",
  });
  const { fullName, phone, email, newUser, newPass, confirmPass } = values;

  const [prevInput, setPrevInput] = useState({});
  const [updateData, setUpdateData] = useState([]);

  const ResetData = () => {
    setValues({
      fullName: "",
      phone: "",
      email: "",
      newUser: "",
      newPass: "",
      confirmPass: "",
    });
    setUpdateData([]);
    setTogglePass(false);
    inputProps[3]("remove");
  };

  const changeInputs = (e) => {
    const { name, value } = e.target;

    if (prevInput[name] !== value) setUpdateData((prev) => [...prev, name]);
    else setUpdateData((prev) => prev.filter((elm) => elm !== name));
    ChangeInputs(e, setValues);
  };

  const UpdateUserAct = (value, type) => {
    if (updateData && updateData.length > 0) {
      const getUserPartThree = users.find((elm) => elm.username === username);

      const createObj = {
        fullName: fullName,
        email: email,
        phone: Number(phone),
        username: newUser,
        password: newPass,
        confirmPassword: confirmPass,
        nvigateTo: getUserPartThree.partThree === "success" ? "all" : value,
        nvigateType:
          getUserPartThree.partThree === "success"
            ? "all"
            : value === "Tek Delivery Service(Cargo)"
            ? "N/A"
            : type,
      };

      const setObj = () => {
        if (newPass === "" && confirmPass === "") {
          delete createObj.password;
          delete createObj.confirmPassword;
          return createObj;
        } else return createObj;
      };
      const createNewObj = setObj();

      axios
        .put(
          `${AdminLoginAPI}/register/${getUserPartThree._id}`,
          createNewObj,
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then(() => {
          loadUsers();
          ResetData();
          setUsername("");
          translatePage("loginForm", "X", "editAcc", "X", "-60");
          inputProps[2]();

          toast.success("Account Updated Successfully");
          setBtnLoad(false);
        })
        .catch((err) => {
          try {
            setBtnLoad(false);

            if (err.stack.includes("Network Error"))
              ModalDialog.error("Network Error", "Can't Connect to Server!");
            if (err.response.data.message)
              ModalDialog.error("Failed", err.response.data.message);
            if (err.response.data.error.errorResponse)
              ModalDialog.error(
                "Failed",
                "This account already has been existed!"
              );
          } catch (error) {
            return null;
          }
        });
    } else {
      ModalDialog.info(
        "Information",
        "Record did't update because there was no changes!"
      );
      setBtnLoad(false);
    }
  };

  const findUsers = (value) => {
    setUpdateData([]);
    const getName = users.find((elm) => elm.username === value);

    if (getName !== undefined) {
      const data = {
        ...getName,
        newUser: getName.username,
        newPass: "",
        confirmPass: "",
      };
      setValues((prev) => ({ ...prev, ...data }));
      setPrevInput(data);
    } else
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

    const getUserPartThree = users.find(
      (elm) => elm.username === values.username
    );

    if (newPass === confirmPass) {
      if (getUserPartThree.partThree === "success") UpdateUserAct();
      else {
        DialogOpen[1](true);
        setPrevInput((prev) => ({
          ...prev,
          value: values.nvigateTo,
          type: values.nvigateType,
        }));
      }
    } else ModalDialog.error("Failed", "Password was not Correctly Confirmed!");
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
              inputProps[3]("add");
            }}
            onFocus={inputProps[0]}
            onBlur={inputProps[1]}
            required
          >
            <option value="Choose...">Choose...</option>
            {users
              .map((user) => user.username)
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
                onChange={(e) => changeInputs(e)}
                inputProps={inputProps}
                icon={FaLock}
                disabled={username === ""}
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
                onChange={(e) => changeInputs(e)}
                inputProps={inputProps}
                icon={FaPhone}
                disabled={username === ""}
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
            onChange={(e) => changeInputs(e)}
            inputProps={inputProps}
            icon={FaEnvelope}
            disabled={username === ""}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="New Username"
            type="text"
            value={newUser}
            name="newUser"
            onChange={(e) => changeInputs(e)}
            inputProps={inputProps}
            icon={FaUserPlus}
            disabled={username === ""}
          />
        </div>

        {togglePass && (
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="input_box m-0 m-lg-0">
                <CreateInput
                  label="New Password"
                  type="password"
                  value={newPass}
                  name="newPass"
                  onChange={(e) => changeInputs(e)}
                  inputProps={inputProps}
                  icon={FaLock}
                  disabled={username === ""}
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
                  onChange={(e) => changeInputs(e)}
                  inputProps={inputProps}
                  icon={FaLock}
                  disabled={username === ""}
                />
              </div>
            </div>
          </div>
        )}

        <ListItem
          className="pb-0"
          style={{
            cursor: "pointer",
            marginTop: togglePass ? "0.5rem" : "-1.4rem",
          }}
          onClick={() =>
            username === "" ? undefined : setTogglePass(!togglePass)
          }
          disabled={username === ""}
        >
          <ListItemIcon style={{ padding: 0 }}>
            <Checkbox
              checked={togglePass}
              disableRipple
              className="editActCheckbox"
            />
          </ListItemIcon>
          <h4
            style={{
              marginLeft: "-4rem",
              marginTop: "0.7rem",
            }}
          >
            Edit Password
          </h4>
        </ListItem>

        <Button
          type="submit"
          className="btn"
          disabled={load || pageLoad || username === ""}
        >
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
            PrevInput: [prevInput, setPrevInput],
            page: false,
            token,
            updateData,
            setUpdateData,
            values,
            notLoginAPI,
            UpdateUserAct,
            translatePage,
            inputProps,
            loadUsers,
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
