import React from "react";

const Chart = props => (
  <div className="chart-container">
    <div className="chart-title">{state.history.story}</div>
    <div className="chart-donut">
      <div className="donut-circle1">2Players</div>
      <div className="donut-circle2">voted</div>
      <div className="donut-circle3">Avg: 40</div>
    </div>
    <div className="chart-votes">
      <ul>
        <li>"k"</li> {/*{state.votes.list[0]}*/}
        <span>50%</span>
        <li>"k"</li>
        <span>50%</span>
      </ul>
    </div>
  </div>
);

export default Chart;
