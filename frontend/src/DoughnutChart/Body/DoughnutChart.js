import React, { Component } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions
} from "@material-ui/core";
import Chartjs from "./../Chart/Chartjs";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData1: {},
      chartData2: {},
      title1: "Assistance with daily living",
      title2: "Assistance with social and community participantion",
      title3: "Comsumables",
      moneyLeft1: 300.0,
      moneyLeft2: 400.0,
      moneyLeft3: 500.0,
      moneyTotal1: 1000.0,
      moneyTotal2: 1500.0,
      moneyTotal3: 2000.0
    };
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    // Ajax calls here
    this.setState({
      chartData1: {
        // labels: ["moneyLeft", "moneyTotal"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [300, 700]
          }
        ]
      },
      chartData2: {
        // labels: ["moneyLeft", "moneyTotal"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2"],
            data: [400, 1100]
          }
        ]
      },
      chartData3: {
        // labels: ["moneyLeft", "moneyTotal"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [500, 1500]
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
            <Card style={{ width: 500, height: 200, position: "relative" }}>
              <div>
                <div style={{ float: "left", width: 150, height: 200 }}>
                  <Chartjs chartData={this.state.chartData1} />
                  <CardContent>
                    <Typography color="textSecondary">
                      ${this.state.moneyLeft1} left
                    </Typography>
                    <Typography color="Black">
                      Total: ${this.state.moneyTotal1}
                    </Typography>
                  </CardContent>
                </div>
                <div
                  style={{
                    width: 300,
                    height: 200,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <CardContent>
                    <Typography component="h1" variant="h6">
                      {this.state.title1}
                    </Typography>
                  </CardContent>
                  <div>
                    <CardActions
                      style={{ position: "absolute", right: 0, bottom: 0 }}
                    >
                      <Button component="span">View</Button>
                    </CardActions>
                  </div>
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs>
            <Card style={{ width: 500, height: 200, position: "relative" }}>
              <div>
                <div style={{ float: "left", width: 150, height: 200 }}>
                  <Chartjs chartData={this.state.chartData2} />
                  <CardContent>
                    <Typography color="textSecondary">
                      ${this.state.moneyLeft2} left
                    </Typography>
                    <Typography color="Black">
                      Total: ${this.state.moneyTotal2}
                    </Typography>
                  </CardContent>
                </div>
                <div
                  style={{
                    width: 300,
                    height: 200,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <CardContent>
                    <Typography component="h1" variant="h6">
                      {this.state.title2}
                    </Typography>
                  </CardContent>
                  <div>
                    <CardActions
                      style={{ position: "absolute", right: 0, bottom: 0 }}
                    >
                      <Button component="span">View</Button>
                    </CardActions>
                  </div>
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs>
            <Card style={{ width: 500, height: 200, position: "relative" }}>
              <div>
                <div style={{ float: "left", width: 150, height: 200 }}>
                  <Chartjs chartData={this.state.chartData3} />
                  <CardContent>
                    <Typography color="textSecondary">
                      ${this.state.moneyLeft3} left
                    </Typography>
                    <Typography color="Black">
                      Total: ${this.state.moneyTotal3}
                    </Typography>
                  </CardContent>
                </div>
                <div
                  style={{
                    width: 300,
                    height: 200,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <CardContent>
                    <Typography component="h1" variant="h6">
                      {this.state.title3}
                    </Typography>
                  </CardContent>
                  <div>
                    <CardActions
                      style={{ position: "absolute", right: 0, bottom: 0 }}
                    >
                      <Button component="span">View</Button>
                    </CardActions>
                  </div>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}
