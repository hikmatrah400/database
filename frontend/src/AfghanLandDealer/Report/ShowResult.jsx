import React from "react";
import ResultCon from "./ResultCon";

const ShowResult = ({ load, title, data, styles }) => {
  const {
    totalPurchases,
    totalSells,
    totalProfit,
    totalComm,
    totalExpenses,
    netProfit,
    profitPercentage,
  } = data;
  const { profit, lose, noProfit } = styles;

  return (
    <>
      <div className="reportCon shadow">
        <h2 className="text-center headerTitle">{title}</h2>

        <div className="allResultCon">
          <ResultCon
            load={load}
            label="Total Purchases:"
            amount={totalPurchases.toLocaleString()}
          />
          <ResultCon
            load={load}
            label="Total Sells:"
            amount={totalSells.toLocaleString()}
          />
          <ResultCon
            load={load}
            label="Total Profit:"
            amount={Number(totalProfit).toLocaleString()}
          />
          <ResultCon
            load={load}
            label="Total Commission:"
            amount={totalComm.toLocaleString()}
          />
          <ResultCon
            load={load}
            label="Total Expenses:"
            amount={totalExpenses.toLocaleString()}
          />

          <ResultCon
            load={load}
            label="Net Profit:"
            amount={netProfit.toLocaleString()}
          />
          <ResultCon
            load={load}
            label="Net Profit %:"
            amount={`${profitPercentage < -100 ? "100.00" : profitPercentage}%`}
          />
          <ResultCon
            load={load}
            label="Status:"
            amount={
              Number(profitPercentage) === 0.0
                ? "No Profit"
                : Number(profitPercentage) < 0
                ? "Lose"
                : "Profit"
            }
            style={
              Number(profitPercentage) === 0
                ? noProfit
                : Number(profitPercentage) < 0
                ? lose
                : profit
            }
          />
        </div>
      </div>
    </>
  );
};

export default ShowResult;
