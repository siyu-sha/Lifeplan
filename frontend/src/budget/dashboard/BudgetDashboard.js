import React from "react";
import BudgetCategorySection from "./BudgetCategorySection";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import _ from "lodash";
import { Doughnut } from "react-chartjs-2";
import CardHeader from "@material-ui/core/CardHeader";
import SupportsPopup from "./SupportsPopup";
import BudgetCategoryCard from "../../DoughnutChart/Body/BudgetCategoryCard";

function generateData() {
  const mainGroups = {
    //coreSupports: ["Core Supports"],
    capital: [
      "Assistive Technology"
      // "Home Modifications"
    ],
    capacityBuilding: [
      //"Coordination of Supports",
      //"Improved Living Arrangements",
      //"Increased Social and Community Participation",
      //"Find and Keep a Job",
      //"Improved Relationships",
      //"Improved Health and Wellbeing",
      "Improved Learning",
      //"Improved Life Choices",
      "Improved Daily Living"
    ]
  };
  let data = {
    //coreSupports: [],
    capital: [],
    capacityBuilding: []
  };
  // mainGroups.coreSupports.map(value => {
  //   const maxAmount = Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
  //   const allocatedAmount = Math.round(Math.random() * maxAmount * 100) / 100;
  //   const color = [
  //     Math.random() * 255,
  //     Math.random() * 255,
  //     Math.random() * 255
  //   ];
  //   data.coreSupports.push({
  //     category: value,
  //     total: maxAmount,
  //     allocated: allocatedAmount,
  //     totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
  //     allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
  //   });
  // });
  mainGroups.capital.map(value => {
    const maxAmount = 5000; //Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
    const allocatedAmount = 0; //Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [0, 0, Math.floor(Math.random() * (255 - 64 - 64)) + 64];
    data.capital.push({
      category: value,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });
  let count = 1;
  mainGroups.capacityBuilding.map(value => {
    const maxAmount = count * 10000;
    count += 1;
    const allocatedAmount = 0; // Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [0, Math.floor(Math.random() * (255 - 64 - 64)) + 64, 0];
    data.capacityBuilding.push({
      category: value,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });

  return data;
}

export default class BudgetDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { ...generateData() },
      openSupports: false,
      activeMainGroup: null,
      activeCategory: null
    };
  }

  handleAddAllocated = (mainGroup, category, amount) => {
    this.setState({
      data: {
        ...this.state.data,
        [mainGroup]: this.state.data[mainGroup].map(value => {
          if (value.category === category) {
            return {
              ...value,
              allocated: value.allocated + amount
            };
          } else {
            return value;
          }
        })
      }
    });
  };

  handleOpenSupports = (mainGroup, category) => {
    this.setState({
      openSupports: true,
      activeMainGroup: mainGroup,
      activeCategory: category
    });
  };

  handleCloseSupports = () => {
    this.setState({ openSupports: false });
  };

  render() {
    const { data } = this.state;
    let total = 0;
    let allocated = 0;
    _.map(data, mainGroup => {
      _.map(mainGroup, category => {
        total += category.total;
        allocated += category.allocated;
      });
    });
    const available = total - allocated;
    return (
      <div className="root">
        <Grid container justify="center">
          <Grid item xs={12} md={11} xl={10}>
            <Card>
              <CardHeader title="Budget Summary" />
              <CardContent>
                <Grid container>
                  <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Doughnut
                      legend={{
                        // display:false,
                        position: "right",
                        onClick: () => {}
                      }}
                      data={{
                        labels: [
                          `Allocated: $${allocated}`,
                          `Available: $${available}`
                        ],
                        datasets: [
                          {
                            data: [allocated, available],
                            backgroundColor: [
                              "rgba(255,0,0,0.5)",
                              "rgba(255,0,0,1)"
                            ]
                          }
                        ]
                      }}
                      options={{
                        tooltips: { enabled: false }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {/*<BudgetCategorySection*/}
            {/*  sectionName="Core Supports"*/}
            {/*  categories={data.coreSupports}*/}
            {/*/>*/}
            <BudgetCategorySection sectionName="Capital">
              {data.capital.map(value => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <BudgetCategoryCard
                      {...value}
                      openSupports={() =>
                        this.handleOpenSupports("capital", value.category)
                      }
                    />
                  </Grid>
                );
              })}
            </BudgetCategorySection>
            <BudgetCategorySection sectionName="Capacity Building">
              {data.capacityBuilding.map(value => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <BudgetCategoryCard
                      {...value}
                      openSupports={() =>
                        this.handleOpenSupports(
                          "capacityBuilding",
                          value.category
                        )
                      }
                    />
                  </Grid>
                );
              })}
            </BudgetCategorySection>
          </Grid>
        </Grid>
        <SupportsPopup
          open={this.state.openSupports}
          closeSupports={this.handleCloseSupports}
          addAllocated={this.handleAddAllocated}
          mainGroup={this.state.activeMainGroup}
          category={this.state.activeCategory}
        />
      </div>
    );
  }
}
