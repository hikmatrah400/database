import React, { useContext, useEffect, useState } from "react";
import "./LockDatabase.scss";
import lock from "./images/lock.gif";
import reactImg from "./images/reactImg.png";
import axios from "axios";
import ShowDialog from "./UI/BsModalDialog/BsModalDialog";
import { lockDatabaseApi } from "./Apis";

const LockDatabase = ({ setLoading, databaseCode }) => {
  const ModalDialog = useContext(ShowDialog);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${lockDatabaseApi}/getLock`);
      setMessage(response.data.data[0].message);
      setError(
        "This Database has been Locked. If you want to unlock this Database please read the below message!"
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server");
      else {
        setError(`Sorry! ${err.response.data.message}`);
        setMessage("Only admin can correct invalid signature");
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const lockDatabase = () => {
    if (window.confirm("Would you like to unlock this Database?")) {
      const msg = prompt("Enter the Code to Unlock");
      if (msg === databaseCode) {
        if (error === "Sorry! Can't Connect to Server!")
          alert("Can't Connect to Server");
        else {
          setLoading(true);
          axios
            .put(
              `${lockDatabaseApi}/lock/10203040`,
              {
                message: "",
              },
              {
                headers: {
                  "auth-token":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibG9ja2RhdGFiYXNlIENvZGUhIiwiaWF0IjoxNzMzNDI2NDI0fQ.1jJpKp6uLk6m1yQVcTQP0bxRaahoVyqjyxNdxr7CXEE",
                },
              }
            )
            .then(() => {
              ModalDialog.success("Locked", "Database has been Unlocked.");
              setLoading(false);
            })
            .catch((err) => {
              if (err.stack.includes("Network Error"))
                ModalDialog.error("Network Error", "Can't Connect to Server");
              else ModalDialog.error("Login Failed", err.response.data);
              setLoading(false);
            });
        }
      } else {
        alert("You have entered wrong Code. Try again!");
      }
    }
  };

  return (
    <>
      <div className="container-fluid text-center pt-5 lockDatabse">
        <h1 className="text-danger mt-5">{error}</h1>

        <img
          src={lock}
          className="img-fluid"
          alt="Browser Can't Support this img."
          width={180}
        />

        <h1 className="text-light mt-5 mb-5">{message}</h1>

        <img
          src={reactImg}
          className="img-fluid mt-5 reactLogo"
          alt="Browser Can't Support this img."
          width={180}
        />
        <h2 className="text-light mt-3" onClick={lockDatabase}>
          React
        </h2>
      </div>
    </>
  );
};

export default LockDatabase;
