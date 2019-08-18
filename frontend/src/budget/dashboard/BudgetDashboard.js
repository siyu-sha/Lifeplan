import React from "react";
import BudgetCategorySection from "./BudgetCategorySection";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import _ from "lodash";
import { Doughnut } from "react-chartjs-2";
import CardHeader from "@material-ui/core/CardHeader";
import BudgetCategoryCard from "../../DoughnutChart/Body/BudgetCategoryCard";
import api from "../../api";
import SupportItemSelector from "./SupportItemSelector";

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
  let count = 1;
  mainGroups.capital.forEach(value => {
    const maxAmount = 5000; //Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
    const allocatedAmount = 0; //Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [0, 0, Math.floor(Math.random() * (255 - 64 - 64)) + 64];
    data.capital.push({
      category: value,
      id: count,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });

  mainGroups.capacityBuilding.forEach(value => {
    const maxAmount = count * 10000;
    count += 1;
    const allocatedAmount = 0; // Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [0, Math.floor(Math.random() * (255 - 64 - 64)) + 64, 0];
    data.capacityBuilding.push({
      category: value,
      id: count,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });

  return data;
}

/**
 * assign the data from backend to the view
 * @param newMainGroup the responded data from server
 * @return newData the new reconstructed data from back end
 */
function backendDataReturn(newMainGroup) {
  let newData = {};
  let newCount = 1;

  newMainGroup.forEach(newValue => {
    let newKey = newValue["name"];
    let categories = newValue["supportCategories"];

    newData[newKey] = [];
    categories.forEach(value => {
      const maxAmount = newCount * 10000; //Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
      newCount += 1;
      const allocatedAmount = 0; //Math.round(Math.random() * maxAmount * 100) / 100;
      const color = [0, 0, Math.floor(Math.random() * (255 - 64 - 64)) + 64];

      const dataValue = {
        category: value.name,
        id: value.id,
        total: maxAmount,
        allocated: allocatedAmount,
        totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
        allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
      };

      newData[newKey].push(dataValue);
    });
  });

  return newData;
}

export default class BudgetDashBoard extends React.Component {
  state = {
    supportGroupData: null,
    data: { ...generateData() },
    openSupports: false,
    activeMainGroup: null,
    activeCategory: null,
    supportCategoryID: 7,
    supportCategoryName: "Assistive technology",
    birthYear: 1990,
    postcode: 3000
  };

  componentDidMount() {
    const isLoggedIn = false;

    let planData = {};

    api.SupportGroups.getAll()
      .then(response => {
        console.log(response.data);
        this.setState({ data: { ...backendDataReturn(response.data) } });
      })
      .catch(error => {
        console.log(error);
      });

    if (isLoggedIn) {
      // TODO: get plan data from backend
      // TODO: get birth year and postcode from backend
    } else {
      // get categories from local storage
    }
    const data = isLoggedIn
      ? {}
      : {
          birthYear: localStorage.getItem("birthYear"),
          postcode: localStorage.getItem("postcode")
        };
    this.setState({
      ...data
    });
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

    const {
      supportCategoryID,
      supportCategoryName,
      birthYear,
      postcode
    } = this.state;

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
            {Object.keys(data).map((dataKey, dataIndex) => {
              return (
                <BudgetCategorySection sectionName={dataKey} key={dataIndex}>
                  {data[dataKey].map((value, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={value.id || index}
                      >
                        <BudgetCategoryCard
                          {...value}
                          openSupports={() =>
                            this.handleOpenSupports(dataKey, value.category)
                          }
                          key={value.id || index}
                        />
                      </Grid>
                    );
                  })}
                </BudgetCategorySection>
              );
            })}
          </Grid>
        </Grid>
        <SupportItemSelector
          open={this.state.openSupports}
          supportCategoryID={supportCategoryID}
          supportCategoryName={supportCategoryName}
          birthYear={birthYear}
          postcode={postcode}
          onClose={this.handleCloseSupports}
        />
      </div>
    );
  }
}
