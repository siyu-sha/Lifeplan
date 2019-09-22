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
import { DARK_BLUE, LIGHT_BLUE } from "../../common/theme";

const isLoggedIn = false;
const PLAN_CATEGORIES = "planCategories";

function calculateAllocated(planItems) {
  let allocated = 0;
  _.forEach(planItems, planItem => {
    const { quantity, price_actual, frequency_per_year } = planItem;
    if ( quantity && price_actual && frequency_per_year) {
      allocated +=
        planItem.quantity * planItem.price_actual * planItem.frequency_per_year;
    }
  });
  return allocated;
}

export default class BudgetDashBoard extends React.Component {
  state = {
    supportGroups: [],
    planCategories: {},
    openSupports: false,
    activeCategory: null,
    birthYear: 1990,
    postcode: 3000
  };

  componentDidMount() {
    // call backend to load all plan groups and corresponding categories
    api.SupportGroups.all()
      .then(response => {
        this.setState({ supportGroups: [...response.data] }, this.loadState);
      })
      .catch(error => {
        console.log(error);
      });

    const personalData = isLoggedIn
      ? {}
      : {
          birthYear: localStorage.getItem("birthYear"),
          postcode: localStorage.getItem("postcode")
        };
    this.setState({
      ...personalData
    });
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (!isLoggedIn && this.state.planCategories !== prevState.planCategories) {
      console.log(this.state.planCategories);
      localStorage.setItem(
        PLAN_CATEGORIES,
        JSON.stringify(this.state.planCategories)
      );
    }
  }

  // load plan categories, birthYear and postcode either from backend if logged in else from local storage
  loadState = () => {
    if (isLoggedIn) {
      // todo: call backend
    } else {
      let cachedPlanCategories = localStorage.getItem(PLAN_CATEGORIES);
      const cachedBirthYear = localStorage.getItem("birthYear");
      const cachedPostcode = localStorage.getItem("postcode");
      if (
        cachedPostcode != null &&
        cachedBirthYear != null &&
        cachedPlanCategories != null
      ) {
        const planCategories = JSON.parse(cachedPlanCategories);
        const birthYear = parseInt(cachedBirthYear);
        const postcode = parseInt(cachedPostcode);
        this.setState({
          planCategories,
          birthYear,
          postcode
        });
      } else {
        this.props.history.push("/budget/edit");
      }
    }
  };

  findSupportCategory = () => {
    let result = null;
    _.forEach(this.state.supportGroups, supportGroup => {
      _.forEach(supportGroup.supportCategories, supportCategory => {
        if (supportCategory.id === this.state.activeCategory) {
          result = supportCategory;
        }
      });
    });
    return result;
  };

  handleOpenSupports = supportCategoryId => {
    console.log(supportCategoryId);
    this.setState({ activeCategory: supportCategoryId }, () => {
      this.setState({ openSupports: true });
    });
  };

  handleCloseSupports = () => {
    this.setState({ openSupports: false });
  };

  handleSetPlanItems = planItems => {
    this.setState({
      planCategories: {
        ...this.state.planCategories,
        [this.state.activeCategory]: {
          ...this.state.planCategories[this.state.activeCategory],
          planItems: planItems
        }
      }
    });
    if (isLoggedIn) {
      // todo: call backend to save changes
    }
  };

  renderSummary = () => {
    let total = 0;
    let allocated = 0;
    _.map(this.state.planCategories, planCategory => {
      if (planCategory.budget !== 0) {
        total += planCategory.budget;
        allocated += calculateAllocated(planCategory.planItems);
      }
    });
    const available = total - allocated;
    return (
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
                      backgroundColor: [DARK_BLUE, LIGHT_BLUE]
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
    );
  };

  renderPlanCategories = () => {
    return _.map(this.state.supportGroups, supportGroup => {
      let renderedPlanCategories = [];
      _.forEach(supportGroup.supportCategories, supportCategory => {
        const planCategory = this.state.planCategories[supportCategory.id];
        if (planCategory.budget > 0) {
          renderedPlanCategories.push(planCategory);
        }
      });
      if (renderedPlanCategories.length !== 0) {
        return (
          <BudgetCategorySection
            sectionName={supportGroup.name}
            key={supportGroup.id}
          >
            {_.map(supportGroup.supportCategories, supportCategory => {
              const planCategory = this.state.planCategories[
                supportCategory.id
              ];
              if (planCategory.budget > 0) {
                return (
                  <Grid
                    key={supportCategory.id}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <BudgetCategoryCard
                      {...{
                        category: supportCategory.name,
                        total: planCategory.budget,
                        allocated: calculateAllocated(planCategory.planItems),
                        totalColor: LIGHT_BLUE,
                        allocatedColor: DARK_BLUE
                      }}
                      openSupports={() =>
                        this.handleOpenSupports(supportCategory.id)
                      }
                    />
                  </Grid>
                );
              }
            })}
          </BudgetCategorySection>
        );
      }
    });
  };

  render() {
    const { planCategories, birthYear, postcode } = this.state;

    return (
      <div className="root">
        <Grid container justify="center">
          {this.state.planCategories !== {} && (
            <Grid item xs={12} md={11} xl={10}>
              {this.renderSummary()}
              {Object.keys(planCategories).length !== 0 &&
                this.renderPlanCategories()}
            </Grid>
          )}
        </Grid>
        {this.state.openSupports && (
          <SupportItemSelector
            open={this.state.openSupports}
            supportCategory={this.findSupportCategory()}
            birthYear={birthYear}
            postcode={postcode}
            onClose={this.handleCloseSupports}
            planCategory={this.state.planCategories[this.state.activeCategory]}
            setPlanItems={this.handleSetPlanItems}
          />
        )}
      </div>
    );
  }
}
