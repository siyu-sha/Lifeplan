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
import connect from "react-redux/es/connect/connect";
import { LocalStorageKeys } from "../../common/constants";

const PLAN_CATEGORIES = "planCategories";

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser
  };
}

function calculateAllocated(planItems) {
  let allocated = 0;
  _.forEach(planItems, planItem => {
    console.log(planItem);
    const { quantity, priceActual, frequencyPerYear } = planItem;
    if (quantity && priceActual && frequencyPerYear) {
      allocated +=
        planItem.quantity * planItem.priceActual * planItem.frequencyPerYear;
    }
  });
  return allocated;
}

class BudgetDashBoard extends React.Component {
  state = {
    supportGroups: [],
    planCategories: {},
    openSupports: false,
    activeCategory: null,
    birthYear: 1990,
    postcode: 3000,
    planId: null
  };

  async componentDidMount() {
    // call backend to load all plan groups and corresponding categories
    let personalData;
    api.SupportGroups.all()
      .then(response => {
        this.setState({ supportGroups: [...response.data] }, this.loadState);
      })
      .catch(error => {
        console.log(error);
      });



  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      this.props.currentUser == null &&
      this.state.planCategories !== prevState.planCategories
    ) {
      console.log(this.state.planCategories);
      localStorage.setItem(
        PLAN_CATEGORIES,
        JSON.stringify(this.state.planCategories)
      );
    }
  }

  // load plan categories, birthYear and postcode either from backend if logged in else from local storage
  loadState = async () => {
    let planCategories = {};
    let birthYear = null;
    let postcode = null;
    if (localStorage.getItem(LocalStorageKeys.ACCESS) != null) {
      await api.Participants.currentUser().then(response => {
        birthYear = response.data.birthYear;
        postcode = response.data.postcode;
      });
      await api.Plans.list().then(async response => {
        // TODO: handle new plan
        if (response.data.length === 0) {
          // TODO: redirect to edit

        }
        else {
          const plan = response.data[0];
          this.setState({planId: plan.id}, () => console.log(this.state.planId));
          console.log(plan);
          await Promise.all(
            _.map(plan.planCategories, async planCategory => {
              const response = await api.PlanItems.list(planCategory.id);
              console.log(response.data);
              planCategories[planCategory.supportCategory] = {
                ...planCategory,
                planItems:response.data
              }
            })
          )

        }
      });
      console.log(planCategories);
      this.setState({
        planCategories,
        birthYear,
        postcode
      });
    } else {
      let cachedPlanCategories = localStorage.getItem(PLAN_CATEGORIES);
      const cachedBirthYear = localStorage.getItem("birthYear");
      const cachedPostcode = localStorage.getItem("postcode");
      if (
        cachedPostcode != null &&
        cachedBirthYear != null &&
        cachedPlanCategories != null
      ) {
        planCategories = JSON.parse(cachedPlanCategories);
        birthYear = parseInt(cachedBirthYear);
        postcode = parseInt(cachedPostcode);
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
    if (this.props.currentUser) {
      // todo: call backend to save changes
    }
  };

  calculateCoreAllocated = () => {
    let allocated = 0;
    console.log(this.state.supportGroups);
    let core = this.state.supportGroups.find(obj => {
      return obj.name === "Core";
    });
    console.log(core);
    _.forEach(core.supportCategories, supportCategory => {
      const planCategory = this.state.planCategories[supportCategory.id];
      allocated += calculateAllocated(planCategory.planItems);
    });
    return allocated;
  };

  renderSummary = () => {
    let total = 0;
    let allocated = 0;
    _.map(this.state.planCategories, planCategory => {
      if (planCategory.budget !== 0) {
        total += parseFloat(planCategory.budget);
        console.log(total);

        allocated += calculateAllocated(planCategory.planItems);
      }
    });
    const available = total - allocated;
    console.log(total);
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
    console.log(this.state.supportGroups);
    return _.map(this.state.supportGroups, supportGroup => {
      if (supportGroup.id === 1) {
        let coreBudget = 0;
        _.forEach(supportGroup.supportCategories, supportCategory => {
          const planCategory = this.state.planCategories[supportCategory.id];
          coreBudget += planCategory.budget;
        });
        let core = supportGroup.supportCategories[1];
        console.log(supportGroup.supportCategories);
        console.log(core);
        if (coreBudget > 0) {
          return (
            <BudgetCategorySection
              sectionName={supportGroup.name}
              key={supportGroup.id}
            >
              <Grid key={"1"} item xs={12} sm={6} md={4} lg={3}>
                <BudgetCategoryCard
                  {...{
                    category: "Core supports",
                    total: coreBudget,
                    allocated: this.calculateCoreAllocated(),
                    totalColor: LIGHT_BLUE,
                    allocatedColor: DARK_BLUE
                  }}
                  openSupports={() => this.handleOpenSupports(3)}
                />
              </Grid>
            </BudgetCategorySection>
          );
        }
        else {
          return
        }

      }

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
                        total: parseFloat(planCategory.budget),
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

export default connect(mapStateToProps)(BudgetDashBoard);
