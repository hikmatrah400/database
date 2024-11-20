import React from "react";
import SimpleLoad from "../../UI/SimpleLoad";

const ResultCon = ({ load, label, amount, style }) => {
  return (
    <div className="d-flex justify-content-center align-items-center resultCon mt-4">
      <div className="col-6">
        <h2>{label}</h2>
      </div>
      <div className="col-4 col-md-3 col-lg-4">
        <h3 className="span" style={style ? style : undefined}>
          {load ? <SimpleLoad /> : amount}
        </h3>
      </div>
    </div>
  );
};

export default ResultCon;
