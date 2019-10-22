import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InputAdornment from "@material-ui/core/InputAdornment/index";
import Grid from "@material-ui/core/Grid/index";
import Paper from "@material-ui/core/Paper/index";
import Typography from "@material-ui/core/Typography/index";
import withStyles from "@material-ui/core/styles/withStyles";
import ValidatedTextField from "../../common/ValidatedTextField";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import api from "../../api";
import Button from "@material-ui/core/Button/index";
import _ from "lodash";
import connect from "react-redux/es/connect/connect";
import {LocalStorageKeys} from "../../common/constants";

function dateToString(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

const styles = {
  paper: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 16
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  number: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  sectionTotalColor: {
    color: "grey"
  }
};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser
  };
}

const PLAN_CATEGORIES = "planCategories";

let moneyRegex = new RegExp(/^-?\d*\.?\d{0,2}$/);
let postcodeRegex = new RegExp(/^\d{0,4}$/);

const today = new Date();

// return date exactly a year from today's date
function getYearFromToday() {
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);
  return nextYear;
}

// processes a string to capitalise the first letter every word
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

MomentUtils.prototype.getStartOfMonth = MomentUtils.prototype.startOfMonth;

class FormPersonalDetails extends React.Component {
  state = {
    supportGroups: [],
    postcode: "",
    birthYear: "",
    startDate: null,
    endDate: null,
    planCategories: {},
    showErrors: false,
    errors: {},
    planId:null
  };

  componentDidMount() {

    api.SupportGroups.all()
      .then(response => {
        this.loadState(response.data);
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.state.postcode !== prevState.postcode ||
      this.state.birthYear !== prevState.birthYear
    ) {
      const errors = this.validate();
      this.setState({ errors: errors });
    }
  }

  loadState = async supportGroups => {

    this.setState({ supportGroups: [...supportGroups] });
    let planCategories = {};
    let birthYear;
    let postcode;
    let startDate;
    let endDate;
    const access = localStorage.getItem(LocalStorageKeys.ACCESS);
    if (access != null) {
      await api.Participants.currentUser().then(response => {
        birthYear = response.data.birthYear;
        postcode = response.data.postcode;
      });
      // TODO: refactor into reusable function
      await api.Plans.list().then(response => {
        if (response.data.length === 0) {
          _.map(supportGroups, supportGroup => {
            _.map(supportGroup.supportCategories, supportCategory => {
              planCategories[supportCategory.id] = {
                budget: 0
              };
            });
          });
          startDate = today;
          endDate = getYearFromToday();
        }
        else {
          const plan = response.data[0];
          this.setState({planId: plan.id});
          startDate = new Date(plan.startDate);
          endDate = new Date(plan.endDate);
          _.map(plan.planCategories, planCategory => {
            planCategories[planCategory.supportCategory] = {
              ...planCategory
            }
          });
        }

      });
    } else {
      let cachedPlanCategories = localStorage.getItem(PLAN_CATEGORIES);
      const cachedBirthYear = localStorage.getItem("birthYear");
      const cachedPostcode = localStorage.getItem("postcode");
      const cachedStartDate = localStorage.getItem("startdate");
      const cachedEndDate = localStorage.getItem("endDate");
      if (cachedPlanCategories == null) {
        _.map(supportGroups, supportGroup => {
          _.map(supportGroup.supportCategories, supportCategory => {
            planCategories[supportCategory.id] = {
              budget: 0,
              planItems: []
            };
          });
        });
      } else {
        planCategories = JSON.parse(cachedPlanCategories);
      }
      birthYear = cachedBirthYear ? parseInt(cachedBirthYear) : "";
      postcode = cachedPostcode ? parseInt(cachedPostcode) : "";
      startDate = cachedStartDate ? new Date(cachedStartDate) : today;
      endDate = cachedEndDate ? new Date(cachedEndDate) : getYearFromToday();
    }

    this.setState(
      {
        planCategories,
        birthYear,
        postcode,
        startDate,
        endDate
      }
    );
  };

  // handle money input
  handleChange = (e, supportCategoryId) => {
    // check if input string is the correct format for money
    if (moneyRegex.test(e.target.value)) {
      // set new amount
      let new_amount;
      if (e.target.value === "") {
        new_amount = 0;
      } else {
        new_amount = parseFloat(e.target.value);
      }
      const planCategories = this.state.planCategories;
      this.setState({
        planCategories: {
          ...planCategories,
          [supportCategoryId]: {
            ...planCategories[supportCategoryId],
            budget: new_amount
          }
        }
      });

      // update category total
      // removed, does not solve any user stories
      // for (let i in this.state.supportGroups) {
      //   let group = this.state.supportGroups[i];
      //
      //   if (
      //     group.supportCategories
      //       .map(function(category) {
      //         return category.name;
      //       })
      //       .indexOf(input) !== -1
      //   ) {
      //     let total = 0;
      //     for (i = 0; i < group.supportCategories.length; i++) {
      //       if (group.supportCategories[i].name === input) {
      //         total += new_amount;
      //       } else if (this.state[group.supportCategories[i].name] !== "") {
      //         total += parseFloat(this.state[group.supportCategories[i].name]);
      //       }
      //     }
      //     total = Math.round(total * 100) / 100;
      //
      //     this.setState({ [group.name]: total });
      //   }
      // }
    }
  };

  // adds up the total of a given budget section
  // commented due to non-usage
  // addTotal(categories, new_amount, changed) {
  //   let total = 0;
  //   for (let i = 0; i < categories.length; i++) {
  //     if (categories[i] === changed) {
  //       total += new_amount;
  //     } else if (this.state[categories[i]] !== "") {
  //       total += parseFloat(this.state[categories[i]]);
  //     }
  //   }
  //   total = Math.round(total * 100) / 100;
  //   return total;
  // }

  // hnadle postcode input by limiting it to 4 digits (also works for year)
  handlePostCodeChange = input => e => {
    if (postcodeRegex.test(e.target.value)) {
      this.setState({ [input]: e.target.value });
    }
  };

  // handle date input
  handleDateChange = input => date => {
    this.setState({ [input]: date.toDate() });
  };

  handleNext = () => {
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      if (this.props.currentUser != null) {
        const body = {
          startDate: dateToString(this.state.startDate),
          endDate: dateToString(this.state.endDate)
        };
        console.log(body);
        const categories =
        _.map(this.state.planCategories, (planCategory, supportCategory) => {
          return {
            ...planCategory,
            supportCategory: supportCategory,
            budget: planCategory.budget
          }
        });
        if (this.state.planId == null) {
          body.supportCategories = categories;
          api.Plans.create(body).then(() => {
            this.props.history.push("/budget/dashboard");
          });
        }
        else {
          body.planCategories = categories;
          api.Plans.update(this.state.planId, body).then(() => {
            this.props.history.push("/budget/dashboard");
          });
        }
      }
      else {
        localStorage.setItem("postcode", this.state.postcode);
        localStorage.setItem("birthYear", this.state.birthYear);
        localStorage.setItem("startDate", this.state.startDate);
        localStorage.setItem("endDate", this.state.endDate);
        localStorage.setItem(
          PLAN_CATEGORIES,
          JSON.stringify(this.state.planCategories)
        );
        this.props.history.push("/budget/dashboard");
      }
    } else {
      console.log(errors);
      this.setState({ errors: errors });
      this.setState({ showErrors: true });
    }
  };

  validate = () => {
    let errors = {};

    if (this.state.postcode == null || this.state.postcode.toString().length !== 4) {
      //this.log.console("postcode is not filled");
      errors.postcode = "Invalid Postcode";
    }

    if (
      this.state.birthYear == null ||
      this.state.birthYear.toString().length !== 4 ||
      this.state.birthYear > today.getFullYear()
    ) {
      errors.birthYear = "Invalid Birth Year";
    }

    // if(this.state.start_date === null){
    //  errors.start_date = "Invalid Start Date";
    //}

    // this.setState({
    //   ...this.state,
    //   ...errors
    // })
    return errors;
  };

  generateStateProperties = () => {
    for (let i in this.state.supportGroups) {
      let group = this.state.supportGroups[i];
      this.setState({ [group.name]: 0 });

      for (let j in group.supportCategories) {
        const category = group.supportCategories[j];
        this.setState({ [category.name]: "" });
      }
    }
  };

  renderPersonalDetailsForm = () => {
    const { classes } = this.props;
    const { errors, showErrors } = this.state;
    return (
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Personal Details</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ValidatedTextField
                className={classes.number}
                required
                label="Postcode"
                onChange={this.handlePostCodeChange("postcode")}
                value={this.state.postcode}
                helperText={"Used to determine appropriate support item prices"}
                type="number"
                error={showErrors}
                errortext={errors.postcode}
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                className={classes.number}
                required
                label="Year of Birth"
                onChange={this.handlePostCodeChange("birthYear")}
                value={this.state.birthYear}
                helperText={"Used to determine appropriate support item prices"}
                type="number"
                error={showErrors}
                errortext={errors.birthYear}
              />
            </Grid>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={12}>
                <DatePicker
                  label="Plan Start Date"
                  value={this.state.startDate}
                  onChange={this.handleDateChange("startDate")}
                  leftArrowIcon={<ChevronLeft />}
                  rightArrowIcon={<ChevronRight />}
                  required
                  format="D MMMM Y"
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  margin="normal"
                  label="Plan End Date"
                  value={this.state.endDate}
                  onChange={this.handleDateChange("endDate")}
                  leftArrowIcon={<ChevronLeft />}
                  rightArrowIcon={<ChevronRight />}
                  required
                  format="D MMMM Y"
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  renderPlanCategories = () => {
    const { planCategories } = this.state;
    const { classes } = this.props;
    return this.state.supportGroups.map((group, index) => {
      return (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{titleCase(group.name)}</Typography>
            <Typography
              variant="h6"
              className={this.props.sectionTotalColor}
              inline="true"
            >
              {" "}
              {/*&nbsp;|&nbsp;Total: ${this.state[group.name]}*/}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={3}>
              {group.supportCategories.map((category, index) => {
                return (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body1">
                      {titleCase(category.name)}
                    </Typography>
                    <ValidatedTextField
                      className={classes.number}
                      onChange={event => this.handleChange(event, category.id)}
                      value={planCategories[category.id].budget || ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
  };

  // render page
  render() {
    const { classes } = this.props;
    const { planCategories } = this.state;
    return (
      Object.keys(planCategories).length !== 0 && (
        <Paper className={classes.paper}>
          {this.renderPersonalDetailsForm()}
          {this.renderPlanCategories()}
          <Grid container justify="flex-end">
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={this.handleNext}
            >
              Next
            </Button>
          </Grid>
        </Paper>
      )
    );
  }
}

export default connect(mapStateToProps)(
  withStyles(styles)(FormPersonalDetails)
);
