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
import Api from "../../api";
import Button from "@material-ui/core/Button/index";

const styles = theme => ({
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
});

var moneyRegex = new RegExp(/^-?\d*\.?\d{0,2}$/);
var postcodeRegex = new RegExp(/^\d{0,4}$/);

// return date exactly a year from today's date
function getYearFromToday() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var c = new Date(year + 1, month, day);
  return c;
}

function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
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
    startDate: new Date(),
    endDate: getYearFromToday()
  };

  // handle money input
  handleChange = input => e => {
    // check if input string is the correct format for money
    if (moneyRegex.test(e.target.value)) {
      // set new amount
      var new_amount;
      if (e.target.value === "") {
        new_amount = 0;
      } else {
        new_amount = parseFloat(e.target.value);
      }
      this.setState({ [input]: e.target.value });

      // update category total
      for (var i in this.state.supportGroups) {
        let group = this.state.supportGroups[i];

        if (
          group.supportCategories
            .map(function(category) {
              return category.name;
            })
            .indexOf(input) != -1
        ) {
          var total = 0;
          for (i = 0; i < group.supportCategories.length; i++) {
            if (group.supportCategories[i].name === input) {
              total += new_amount;
            } else if (this.state[group.supportCategories[i].name] !== "") {
              total += parseFloat(this.state[group.supportCategories[i].name]);
            }
          }
          total = Math.round(total * 100) / 100;

          this.setState({ [group.name]: total });
        }
      }
    }
  };

  //  adds up the total of a given budget section
  addTotal(categories, new_amount, changed) {
    var total = 0;
    for (var i = 0; i < categories.length; i++) {
      if (categories[i] === changed) {
        total += new_amount;
      } else if (this.state[categories[i]] !== "") {
        total += parseFloat(this.state[categories[i]]);
      }
    }
    total = Math.round(total * 100) / 100;
    return total;
  }

  // hnadle postcode input by limiting it to 4 digits (also works for year)
  handlePostCodeChange = input => e => {
    if (postcodeRegex.test(e.target.value)) {
      this.setState({ [input]: e.target.value });
    }
  };

  // handle date input
  handleDateChange = input => date => {
    this.setState({ [input]: date });
  };

  validate = () => {
    let errors = {
      // postcode : "",
      // start_date : "",
      // birthYear : "",
      // assistanceDaily : "",
      // transport : "",
      // consumables : "",
      // assistanceSocial : "",
      // assistiveTechnology : "",
      // homeModifications : "",
      // coordinationSupport : "",
      // living_arrangements : "",
      // community_participation : "",
      // employment : "",
      // relationships : "",
      // health_wellbeing : "",
      // learning : "",
      // life_choices : "",
      // daily_living : ""
    };

    if (this.state.postcode.toString().length !== 4) {
      //this.log.console("postcode is not filled");
      errors.postcode = "Invalid Postcode";
    }

    if (this.state.birthYear < 1900 || this.state.birthYear > 2019) {
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
    for (var i in this.state.supportGroups) {
      let group = this.state.supportGroups[i];
      this.setState({ [group.name]: 0 });

      for (var j in group.supportCategories) {
        let category = group.supportCategories[j];
        this.setState({ [category.name]: "" });
      }
    }
  };

  componentDidMount() {
    Api.SupportGroups.getAll()
      .then(response => {
        this.setState({ supportGroups: response.data });
        this.generateStateProperties();
      })
      .catch(err => console.log(err));
  }

  // render page
  render() {
    const { classes } = this.props;
    const errors = this.validate();

    return (
      <Paper className={classes.paper}>
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
                  error={errors.postcode}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  className={classes.number}
                  required
                  label="Year of Birth"
                  onChange={this.handlePostCodeChange("birthYear")}
                  value={this.state.birthYear}
                  error={errors.birthYear}
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

        {this.state.supportGroups.map((group, index) => {
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
                  &nbsp;|&nbsp;Total: ${this.state[group.name]}
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
                          onChange={this.handleChange(category.name)}
                          value={this.state[category.name] || ""}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
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
        })}
        <Grid container justify="flex-end">
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            //onClick={this.handleNext}
            href="/budget/dashboard"
          >
            Next
          </Button>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(FormPersonalDetails);
