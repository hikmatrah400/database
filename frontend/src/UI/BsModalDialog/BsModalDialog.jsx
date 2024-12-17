import React, { createContext, useState } from "react";
import "./BsModalDialog.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Backdrop } from "@mui/material";

const ShowDialog = createContext();

const BsModalDialog = ({ children, theme = "light", direction = "top" }) => {
  const useStyles = makeStyles(() => ({
    backdrop: {
      width: "100%",
      zIndex: 9999999,
      color: "#fff",
      transition: "all 0.3s ease !important",
    },
  }));
  const classes = useStyles();

  const [modalDialog, setModalDialog] = useState({});
  const [open, setOpen] = useState(false);

  const ShowMessage = (value, opacity, open) => {
    document.getElementById("messageContainer--root").style.marginTop = value;
    document.getElementById("messageContainer--root").style.opacity = opacity;

    setOpen(open);
    setTimeout(() => {
      document.getElementById("dialog-btn-root").focus();
    }, 100);
  };

  const SetDialog =
    (value) =>
    (
      title = "Modal Title",
      content = "Write a Message",
      msgBtns = "OK",
      ClickedBtn,
      ClickedNo
    ) => {
      ShowMessage(`${direction === "center" ? "-2rem" : "1rem"}`, "1", true);

      setModalDialog({
        title: title,
        content: content,
        msgBtns: msgBtns,
        msgStyle: value,
        ClickedBtn: ClickedBtn,
        ClickedNo: ClickedNo,
      });
    };

  const { title, content, msgBtns, msgStyle, ClickedBtn, ClickedNo } =
    modalDialog;

  const GetDialog = {
    simple: SetDialog("none"),
    success: SetDialog("success"),
    error: SetDialog("danger"),
    warning: SetDialog("warning"),
    info: SetDialog("primary"),
  };

  return (
    <>
      <ShowDialog.Provider value={GetDialog}>
        {children}

        <Backdrop className={classes.backdrop} open={open}>
          <div
            className={`container-fluid ${
              direction === "top"
                ? "position-absolute top-0"
                : direction === "center"
                ? null
                : null
            }`}
          >
            <div className="row justify-content-center bsModalContainer">
              <div
                className="col-12 col-sm-9 col-md-7 col-lg-6 col-xl-5 col-xxl-4"
                id="messageContainer--root"
                style={{
                  opacity: "0",
                  marginTop: `${
                    direction === "center" ? "-18rem" : "-10.5rem"
                  }`,
                  transition: "all 0.4s ease-out",
                }}
              >
                <div className={`modal-dialog`}>
                  <div
                    className={`modal-content rounded-4 overflow-hidden bg-${theme} text-${
                      theme === "dark" ? "light" : "dark"
                    }`}
                  >
                    <div
                      className={`modal-header pe-3 d-flex justify-content-between bg-${
                        msgStyle === "none" ? "light" : msgStyle
                      } ${
                        msgStyle === "warning" ||
                        msgStyle === "info" ||
                        (msgStyle === "none" && theme !== "dark")
                          ? "text-dark"
                          : "text-white"
                      }`}
                      style={{ padding: "13px" }}
                    >
                      <h2 className="modal-title">{title}</h2>

                      <button
                        onClick={() =>
                          ShowMessage(
                            `${direction === "center" ? "-18rem" : "-10.5rem"}`,
                            "0",
                            false
                          )
                        }
                        type="button"
                        className={`btn-close ${
                          msgStyle === "warning" ||
                          msgStyle === "info" ||
                          (msgStyle === "none" && theme !== "dark")
                            ? null
                            : "btn-close-white"
                        }`}
                      ></button>
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #D3D6D9",
                        borderBottom: "1px solid #D3D6D9",
                        padding: "18px 12px",
                        background: "white",
                      }}
                    >
                      {content}
                    </div>

                    <div
                      className="modal-footer p-3"
                      style={{ background: "white" }}
                    >
                      {msgBtns === "OK" ? (
                        <button
                          type="button"
                          id="dialog-btn-root"
                          className={`btn modalBtn btn-${
                            msgStyle !== "none" ? msgStyle : "primary"
                          } px-4`}
                          onClick={() => {
                            ShowMessage(
                              `${
                                direction === "center" ? "-18rem" : "-10.5rem"
                              }`,
                              "0",
                              false
                            );
                            ClickedBtn && ClickedBtn();
                          }}
                        >
                          OK
                        </button>
                      ) : msgBtns === "Yes/No" ? (
                        <>
                          <button
                            id="dialog-btn-root"
                            onClick={() => {
                              ShowMessage(
                                `${
                                  direction === "center" ? "-18rem" : "-10.5rem"
                                }`,
                                "0",
                                false
                              );
                              if (ClickedNo) {
                              }
                              ClickedNo && ClickedNo();
                            }}
                            type="button"
                            className={`btn modalBtn btn-outline-${
                              msgStyle === "none" ? "primary" : msgStyle
                            } px-4 me-2`}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            className={`btn modalBtn btn-${
                              msgStyle !== "none" ? msgStyle : "primary"
                            } ${
                              msgStyle === "warning" ||
                              msgStyle === "info" ||
                              msgStyle === "none"
                                ? null
                                : "text-white"
                            } px-4`}
                            onClick={() => {
                              ShowMessage(
                                `${
                                  direction === "center" ? "-18rem" : "-10.5rem"
                                }`,
                                "0",
                                false
                              );
                              ClickedBtn && ClickedBtn();
                            }}
                          >
                            Yes
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Backdrop>
      </ShowDialog.Provider>
    </>
  );
};

BsModalDialog.propTypes = {
  theme: PropTypes.string,
  direction: PropTypes.string,
};

export default ShowDialog;
export { BsModalDialog };
