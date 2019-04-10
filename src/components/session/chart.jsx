import React from "react";

const Chart = () => (
  <div className="chart-container">
    <div className="chart-title">enter history in props</div>
    <div className="chart-donut">
      <div className="donut-circle1">2Players</div>
      <div className="donut-circle2">voted</div>
      <div className="donut-circle3">Avg: 40</div>
    </div>
    <div className="chart-votes">
      <ul>
        <li>vote</li>
        <span>50%</span>
        <li>vote</li>
        <span>50%</span>
      </ul>
    </div>
  </div>
);

export default Chart;
