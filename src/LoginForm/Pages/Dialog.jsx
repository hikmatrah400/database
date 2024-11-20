import React, { useContext, useEffect, useState } from "react";
import "../Styles/Dialog.scss";
import Button from "@material-ui/core/Button";
import { Backdrop, makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import axios from "axios";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";

const Dialog = ({
  page,
  Open,
  values,
  username,
  UpdateUserAct,
  translatePage,
  inputProps,
  loadData,
  notLoginAPI,
  AdminLoginAPI,
  ResetData,
  setBtnLoad,
}) => {
  const ModalDialog = useContext(ShowDialog);
  const [value, setValue] = useState("");
  const [type, setType] = useState("");

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      width: "100%",
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    setValue(values.nvigateTo);
    setType(values.nvigateType);

    // eslint-disable-next-line
  }, [username]);

  const FormSubmit = (e) => {
    e.preventDefault();

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

    Open[1](false);
    setBtnLoad(true);

    if (page) {
      axios
        .post(AdminLoginAPI, {
          id: values.id,
          fullName: values.fullName,
          email: values.email,
          phone: Number(values.phone),
          partOne: values.username,
          partTwo: values.password,
          nvigateTo: value,
          nvigateType: value === "Tek Delivery Service(Cargo)" ? "N/A" : type,
          partThree: "failed",
        })
        .then(() => {
          axios
            .post(notLoginAPI, {
              id: values.id,
              partOne: values.username,
              userCode: "No Match",
              path: "No Match",
              badgeColor: newBadge,
              nvigateType:
                value === "Tek Delivery Service(Cargo)" ? "N/A" : type,
            })
            .then(() => {
              loadData();
              translatePage("loginForm", "X", "registerForm", "X", "60");
              inputProps[2]();
              ResetData();
              setValue("");
              setType("");
              setBtnLoad(false);
              toast.success("Account Added Successfully.");
            })
            .catch(() => {
              setBtnLoad(false);
              ModalDialog.error("Network Error", "Can't connect to Server");
            });
        })
        .catch(() => {
          setBtnLoad(false);
          ModalDialog.error("Network Error", "Can't connect to Server");
        });
    } else UpdateUserAct(value, type);
  };

  return (
    <>
      <Backdrop open={Open[0]} className={`${classes.backdrop}`}>
        <div className="container dialogContiner">
          <form className="row justify-content-center" onSubmit={FormSubmit}>
            <div className="adminPass_dialog col-10 col-sm-8 col-md-8 col-lg-6 col-xl-4 pb-0">
              <h3 className="mb-4">{page ? "Create" : "Edit"} Account</h3>

              <div className="row pt-3" style={{ background: "transparent" }}>
                <div className="col-12 col-md-8">
                  <select
                    className="form-select"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose Page Name
                    </option>
                    <option value="Afghan Land & Dealer">
                      Afghan Land & Dealer
                    </option>
                    <option value="Stock Market Shop">Stock Market Shop</option>
                    <option value="Tek Delivery Service(Cargo)" disabled>
                      Tek Delivery Service(Cargo)
                    </option>
                  </select>
                </div>

                <div className="col-12 col-md-4 mt-4 mt-md-0">
                  <select
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
