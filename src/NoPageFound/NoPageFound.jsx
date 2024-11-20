import React from "react";
import { useNavigate } from "react-router-dom";
import SimpleLoad from "../UI/SimpleLoad";

const NoPageFound = ({ loading }) => {
  const navigate = useNavigate();
  return (
    <div className="container text-center" style={{ marginTop: "10rem" }}>
      <h1 className="text-danger mt-4" style={{ fontSize: "2.5rem" }}>
        {loading ? "Please Wait..." : "You have Entered Wrong Path"}
      </h1>

      <h1 className="mt-1" style={{ fontSize: "3.5rem" }}>
        {loading ? "Data is Loading from Server!" : "Page Not Found!"}
      </h1>

      {loading ? (
        <div className="mt-5">
          <SimpleLoad size={50} />
        </div>
      ) : (
        <button
          style={{ fontSize: "1.7rem", padding: "0.5rem 2.2rem" }}
          className="btn btn-primary btn-lg mt-4"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      )}
    </div>
  );
};

export default NoPageFound;
