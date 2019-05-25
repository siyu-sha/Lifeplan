import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import DoughnutCard from "./DoughnutCard";
import Chartjs from "./../Chart/Chartjs";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData1: {},
      chartData2: {}
    };
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    // Ajax calls here
    this.setState({
      chartData1: {
        // labels: ["mma", "Asia", "Europe"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [2478, 5267, 734]
          }
        ]
      },
      chartData2: {
        // labels: ["mmcxcxzc", "Asia", "Europe"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [203, 5267, 734]
          }
        ]
      },
      chartData3: {
        // labels: ["mma", "Asia", "Europe"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [78, 52, 34]
          }
        ]
      }
    });
  }

  render() {
    return (
      <div style={{ marginTop: 40, padding: 300 }}>
        <Grid container spacing={40}>
          <Grid item xs>
            <DoughnutCard
              amount="600"
              totalAmount="2000"
              title="Assitance with daily living!"
            />
            <Chartjs chartData={this.state.chartData1} />
          </Grid>

          <Grid item xs>
            <DoughnutCard
              amount="100"
              totalAmount="200"
              title="Assitance with social and community participation!!"
            />
            <Chartjs chartData={this.state.chartData2} />
          </Grid>

          <Grid item xs>
            <DoughnutCard amount="600" totalAmount="2000" title="Consumables" />
            <Chartjs chartData={this.state.chartData3} />
          </Grid>
        </Grid>
      </div>
    );
  }
}
