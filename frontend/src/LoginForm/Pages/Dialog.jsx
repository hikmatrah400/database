import React, { useContext, useEffect, useState } from "react";
import "../Styles/Dialog.scss";
import Button from "@mui/material/Button";
import { Backdrop } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const Dialog = ({
  AdminLoginAPI,
  token,
  PrevInput,
  page,
  Open,
  values,
  username,
  UpdateUserAct,
  translatePage,
  inputProps,
  loadUsers,
  setUpdateData,
  ResetData,
  setBtnLoad,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [value, setValue] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    setValue(values.nvigateTo);
    setType(values.nvigateType);

    // eslint-disable-next-line
  }, [username]);

  const changeInputs = (e, fieldValue) => {
    const { name, value } = e.target;

    if (PrevInput && setUpdateData) {
      if (PrevInput[0][name] !== value)
        setUpdateData((prev) => [...prev, name]);
      else setUpdateData((prev) => prev.filter((elm) => elm !== name));
    }
    fieldValue(value);
  };

  const FormSubmit = (e) => {
    e.preventDefault();
    setBtnLoad(true);
    Open[1](false);

    if (page) {
      axios
        .post(
          `${AdminLoginAPI}/register`,
          {
            fullName: values.fullName,
            email: values.email,
            phone: Number(values.phone),
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPass,
            nvigateTo: value,
            nvigateType: value === "Tek Delivery Service(Cargo)" ? "N/A" : type,
          },
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then(() => {
          loadUsers();
          translatePage("loginForm", "X", "registerForm", "X", "60");
          inputProps[2]();
          ResetData();
          setValue("");
          setType("");
          setBtnLoad(false);
          Open[1](false);
          toast.success("Account Created Successfully.");
        })
        .catch((err) => {
          try {
            setBtnLoad(false);
            Open[1](true);

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
    } else UpdateUserAct(value, type);
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({
          backdrop: {
            width: "100%",
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
          },
        })}
        open={Open[0]}
      >
        <div className="container dialogContiner">
          <form className="row justify-content-center" onSubmit={FormSubmit}>
            <div className="adminPass_dialog col-10 col-sm-8 col-md-8 col-lg-6 col-xl-4 pb-0">
              <h3 className="mb-4">{page ? "Create" : "Edit"} Account</h3>

              <div className="row pt-3" style={{ background: "transparent" }}>
                <div className="col-12 col-md-8">
                  <select
                    className="form-select"
                    value={value}
                    name="value"
                    onChange={(e) => changeInputs(e, setValue)}
                    required
                  >
                    <option value="" disabled>
                      Choose Page Name
                    </option>
                    <option value="afghanAndDealer">
                      Afghan Land & Dealer
                    </option>
                    <option value="stockMarket">Stock Market Shop</option>
                    <option value="deliveryCargo" disabled>
                      Tek Delivery Service(Cargo)
                    </option>
                  </select>
                </div>

                <div className="col-12 col-md-4 mt-4 mt-md-0">
                  <select
                    className="form-select"
                    value={type}
                    name="type"
                    onChange={(e) => changeInputs(e, setType)}
                    required
                    disabled={
                      value === "" || value === "Tek Delivery Service(Cargo)"
                    }
                  >
                    <option value="" disabled>
                      Choose Type
                    </option>
                    <option value="Purchaser">Purchaser</option>
                    <option value="Seller">Seller</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <Button onClick={() => Open[1](false)} className="dialogBtn">
                  Cancel
                </Button>
                <Button type="submit" className="dialogBtn">
                  OK
                </Button>
              </div>

              <p
                className="mb-3 text-start mt-4"
                style={{ color: "gray", fontWeight: "600", fontSize: "1.4rem" }}
              >
                Please Select Page Name or Type for User Account
              </p>
            </div>
          </form>
        </div>
      </Backdrop>
    </>
  );
};

export default Dialog;
