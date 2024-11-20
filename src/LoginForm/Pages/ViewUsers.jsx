import React, { useState } from "react";
import "../Styles/ViewUsers.scss";
import SimpleLoad from "../../UI/SimpleLoad";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";

const ViewUsers = ({ load, viewUsers, inputProps }) => {
  const [showID, setShowID] = useState("");

  return (
    <>
      <form>
        <div className="usersContainer" id="userBox">
          <h1 className="text-center mt-5">User's Accounts</h1>

          <div className="container-fluid px-3 px-md-5 mt-4">
            <div
              className="table-responsive gridView"
              style={{ height: "calc(100vh - 18rem)" }}
            >
              <table className="table table-hover">
                <tbody>
                  {load ? (
                    <>
                      <tr>
                        <td colSpan={10} className="fs-3 fw-medium">
                          <span className="me-4">Loading Data...</span>
                          <SimpleLoad />
                        </td>
                      </tr>
                    </>
                  ) : viewUsers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="fs-3 text-danger fw-medium">
                        No Record Found!
                      </td>
                    </tr>
                  ) : (
                    viewUsers.map((elm, ind) => {
                      const {
                        id,
                        fullName,
                        email,
                        phone,
                        partOne,
                        partTwo,
                        nvigateTo,
                        nvigateType,
                      } = elm;

                      return (
                        <tr key={ind}>
                          <td>{ind + 1}</td>
                          <td>{fullName}</td>
                          <td>{email}</td>
                          <td>{phone}</td>
                          <td>{partOne}</td>
                          <td style={{ width: "28rem" }}>
                            <div className="d-flex justify-content-evenly">
                              <input
                                autoComplete="off"
                                type={id === showID ? "text" : "password"}
                                value={partTwo}
                                readOnly
                              />
                              {id === showID ? (
                                <IconButton
                                  className="p-0"
                                  onClick={() => setShowID("")}
                                >
                                  <FaEyeSlash
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "1.7rem",
                                    }}
                                  />
                                </IconButton>
                              ) : (
                                <IconButton
                                  className="p-0"
                                  onClick={() => setShowID(id)}
                                >
                                  <FaRegEye
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "1.7rem",
                                    }}
                                  />
                                </IconButton>
                              )}
                            </div>
                          </td>
                          <td className="text-capitalize">{nvigateTo}</td>
                          <td className="text-capitalize">{nvigateType}</td>
                          <td>{nvigateTo === "all" ? "Admin" : "User"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                <thead>
                  <tr>
                    <th className="px-5 px-xl-0">S.No</th>
                    <th className="px-5 px-xl-0">Name</th>
                    <th className="px-5 px-xl-0">Email</th>
                    <th className="px-5 px-xl-0">Phone#</th>
                    <th className="px-5 px-xl-0">Username</th>
                    <th className="px-5 px-xl-0">Password</th>
                    <th className="px-5 px-xl-0">Selected Page</th>
                    <th className="px-5 px-xl-0">Selected Type</th>
                    <th className="px-5 px-xl-0">Type</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <h5
            onClick={() => {
              document.getElementById("userBox").style.transform =
                "translateY(-120%)";

              translatePage("loginForm", "X", "adminPass", "Y", "-60");
              inputProps[2]();
            }}
          >
            Back to Login
          </h5>
        </div>
      </form>
    </>
  );
};

export default ViewUsers;
