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

function dateToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const styles = {
  paper: {
    marginTop: 16,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 16,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  number: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  sectionTotalColor: {
    color: "grey",
  },
  buttonMargin: {
    marginTop: 10,
  },
};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
  };
}

let moneyRegex = new RegExp(/^-?\d*\.?\d{0,2}$/);
let nameRegex = new RegExp(/^[a-zA-Z ]+$/);

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

class BudgetAddForm extends React.Component {
  state = {
    hcpSupportGroups: [],
    hcpSupportCategories: [],
    name: null,
    startDate: null,
    endDate: null,
    showErrors: false,
    errors: {},
    flag: false,
    hcpPlanCategories: {},
  };

  componentDidMount() {
    api.Hcp_SupportGroups.all()
      .then((response) => {
        this.loadState(response.data);
      })
      .catch((err) => console.log(err));
  }

  loadState = async (hcpSupportGroups) => {
    this.setState({ hcpSupportGroups: [...hcpSupportGroups] });
    _.map(hcpSupportGroups, (hcpSupportGroup) => {
      _.map(hcpSupportGroup.hcpSupportCategories, (hcpSupportCategory) => {
        this.state.hcpPlanCategories[hcpSupportCategory.id] = {
          hcpSupportCategory: hcpSupportCategory.id,
          budget: 0,
        };
      });
    });
    this.setState({
      startDate: today,
      endDate: getYearFromToday(),
    });
  };

  // handle name input
  handleNameChange = (input) => (e) => {
    if (nameRegex.test(e.target.value)) {
      this.setState({ [input]: e.target.value });
    }
  };

  // handle start date input
  handleStartDateChange = (input) => (date) => {
    this.setState({ [input]: date.toDate() });
  };

  // handle date input
  handleEndDateChange = (input) => (date) => {
    this.setState({ [input]: date.toDate() });
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
      const hcpPlanCategories = this.state.hcpPlanCategories;
      this.setState({
        hcpPlanCategories: {
          ...hcpPlanCategories,
          [supportCategoryId]: {
            ...hcpPlanCategories[supportCategoryId],
            budget: new_amount,
          },
        },
      });
    }
  };

  handleAdd = () => {
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      if (this.props.currentUser != null) {
        const body = {
          name: this.state.name,
          startDate: dateToString(this.state.startDate),
          endDate: dateToString(this.state.endDate),
        };
        const hcpCategories = _.map(
          this.state.hcpPlanCategories,
          (hcpPlanCategory, hcpSupportCategory) => {
            return {
              ...hcpPlanCategory,
              name:'',
              hcpSupportCategory: hcpSupportCategory,
              budget: hcpPlanCategory.budget,
              hcpPlanItemGroups:[]
            };
          }
        );
        console.log('123');
        // body.hcpSupportCategories = hcpCategories;
        body.hcpSupportCategories = hcpCategories;
        console.log(body);
        api.Hcp_Plans.create(body).then(() => {
          window.location.href = "/hcp/budget/edit";
        });
      } else {
        localStorage.setItem("name", this.state.name);
        localStorage.setItem("startDate", this.state.startDate);
        localStorage.setItem("endDate", this.state.endDate);
      }
    } else {
      console.log(errors);
      this.setState({ errors: errors });
      this.setState({ showErrors: true });
    }
  };

  validate = () => {
    let errors = {};

    if (this.state.name == null) {
      errors.name = "Invalid Name";
    }

    // if (this.state.startDate === null) {
    //   errors.startDate = "Invalid Start Date";
    // }

    // if (this.state.endDate === null) {
    //   errors.endDate = "Invalid End Date";
    // }

    return errors;
  };

  renderPlanDetailsForm = () => {
    // const { classes } = this.props;
    const { errors, showErrors } = this.state;
    return (
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Plan Details</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ValidatedTextField
                label="Name"
                required
                fullWidth
                onChange={this.handleNameChange("name")}
                value={this.state.name}
                type="text"
                error={showErrors}
                errortext={errors.name}
              />
            </Grid>
            {/* <Grid item xs={12}>*/}
            {/*  <ValidatedTextField*/}
            {/*    label="NDIS Number"*/}
            {/*    required*/}
            {/*    fullWidth*/}
            {/*    onChange={this.handleNDISNumberChange("ndisNumber")}*/}
            {/*    value={this.state.ndisNumber}*/}
            {/*    type="number"*/}
            {/*    error={showErrors}*/}
            {/*    errortext={errors.ndisNumber}*/}
            {/*  />*/}
            {/*</Grid>*/}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={12}>
                <DatePicker
                  label="Plan Start Date"
                  value={this.state.startDate}
                  onChange={this.handleStartDateChange("startDate")}
                  leftArrowIcon={<ChevronLeft />}
                  rightArrowIcon={<ChevronRight />}
                  required
                  fullWidth
                  format="D MMMM Y"
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  margin="normal"
                  label="Plan End Date"
                  value={this.state.endDate}
                  onChange={this.handleEndDateChange("endDate")}
                  leftArrowIcon={<ChevronLeft />}
                  rightArrowIcon={<ChevronRight />}
                  required
                  fullWidth
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
    // const { hcpPlanCategories } = this.state;
    const { classes } = this.props;
    return this.state.hcpSupportGroups.map((group, index) => {
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
              {group.hcpSupportCategories.map((category, index) => {
                return (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body1">
                      {titleCase(category.name)}
                    </Typography>
                    <ValidatedTextField
                      className={classes.number}
                      onChange={(event) =>
                        this.handleChange(event, category.id)
                      }
                      // value={hcpPlanCategories[category.id] || ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
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
    return (
      <Paper className={classes.paper}>
        {this.renderPlanDetailsForm()}
        {/*{this.renderPlanCategories()}*/}
        <Grid container justify="flex-end" className={classes.buttonMargin}>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={this.handleAdd}
          >
            Add
          </Button>
        </Grid>
      </Paper>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(BudgetAddForm));
