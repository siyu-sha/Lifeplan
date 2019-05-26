import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class Chartjs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    };
  }

  render() {
    return (
      <div className="chart" style={{ width: 100, height: 100 }}>
        <Doughnut
          data={this.state.chartData}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
}

export default Chartjs;
