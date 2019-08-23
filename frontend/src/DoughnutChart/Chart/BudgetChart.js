import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class BudgetChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    };
  }

  render() {
    return (
      <Doughnut
        legend={{
          // display:false,
          position: "right",
          onClick: () => {}
        }}
        data={this.state.chartData}
        options={{
          tooltips: { enabled: false }
        }}
      />
    );
  }
}

export default BudgetChart;
