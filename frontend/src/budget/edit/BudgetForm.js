import React from "react";
import Button from "@material-ui/core/Button/index";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InputAdornment from "@material-ui/core/InputAdornment/index";
import Grid from "@material-ui/core/Grid/index";
import Paper from "@material-ui/core/Paper/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import withStyles from "@material-ui/core/styles/withStyles";
import ValidatedTextField from "../../common/ValidatedTextField";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

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

const core_categories = [
  "assistanceDaily",
  "transport",
  "consumables",
  "assistanceSocial"
];
const capital_categories = ["assistiveTechnology", "homeModifications"];
const capacity_categories = [
  "coordinationSupport",
  "employment",
  "livingArrangements",
  "relationships",
  "healthWellbeing",
  "learning",
  "lifeChoices",
  "dailyLiving",
  "communityParticipation"
];

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

MomentUtils.prototype.getStartOfMonth = MomentUtils.prototype.startOfMonth;

class FormPersonalDetails extends React.Component {
  state = {
    postcode: "",
    birthYear: "",
    startDate: new Date(),
    endDate: getYearFromToday(),
    assistanceDaily: "",
    transport: "",
    consumables: "",
    assistanceSocial: "",
    assistiveTechnology: "",
    homeModifications: "",
    coordinationSupport: "",
    livingArrangements: "",
    communityParticipation: "",
    employment: "",
    relationships: "",
    healthWellbeing: "",
    learning: "",
    lifeChoices: "",
    dailyLiving: "",
    coreTotal: 0,
    capitalTotal: 0,
    capacityTotal: 0
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
      if (core_categories.includes(input)) {
        this.setState({
          coreTotal: this.addTotal(core_categories, new_amount, input)
        });
      } else if (capital_categories.includes(input)) {
        this.setState({
          capitalTotal: this.addTotal(capital_categories, new_amount, input)
        });
      } else if (capacity_categories.includes(input)) {
        this.setState({
          capacityTotal: this.addTotal(capacity_categories, new_amount, input)
        });
      }
    }
  };

  // hnadle postcode input by limiting it to 4 digits (also works for year)
  handlePostCodeChange = input => e => {
    if (postcodeRegex.test(e.target.value)) {
      this.setState({ [input]: e.target.value });
    }
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
      console.log(this.state.postcode);
      errors.postcode = "Invalid Postcode";
    }

    if (this.state.birthYear < 1900 || this.state.birthYear > 2019) {
      errors.birthYear = "Invalid Birth Year";
    }

    if (this.state.assistanceDaily < 0) {
      errors.assistanceDaily = "Please Enter A Positive Number";
    }

    if (this.state.transport < 0) {
      errors.transport = "Please Enter A Positive Number";
    }

    if (this.state.consumables < 0) {
      errors.consumables = "Please Enter A Positive Number";
    }

    if (this.state.assistanceSocial < 0) {
      errors.assistanceSocial = "Please Enter A Positive Number";
    }

    if (this.state.assistiveTechnology < 0) {
      errors.assistiveTechnology = "Please Enter A Positive Number";
    }

    if (this.state.homeModifications < 0) {
      errors.homeModifications = "Please Enter A Positive Number";
    }

    if (this.state.coordinationSupport < 0) {
      errors.coordinationSupport = "Please Enter A Positive Number";
    }

    if (this.state.livingArrangements < 0) {
      errors.livingArrangements = "Please Enter A Positive Number";
    }

    if (this.state.communityParticipation < 0) {
      errors.communityParticipation = "Please Enter A Positive Number";
    }

    if (this.state.employment < 0) {
      errors.employment = "Please Enter A Positive Number";
    }

    if (this.state.relationships < 0) {
      errors.relationships = "Please Enter A Positive Number";
    }

    if (this.state.healthWellbeing < 0) {
      errors.healthWellbeing = "Please Enter A Positive Number";
    }

    if (this.state.learning < 0) {
      errors.learning = "Please Enter A Positive Number";
    }

    if (this.state.lifeChoices < 0) {
      errors.lifeChoices = "Please Enter A Positive Number";
    }

    if (this.state.dailyLiving < 0) {
      errors.dailyLiving = "Please Enter A Positive Number";
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

  // go to next page
  handleNext = () => {
    /* not yet implemented */
  };

  // handle date input
  handleDateChange = input => date => {
    this.setState({ [input]: date });
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
            <Grid container spacing={24}>
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
                    margin="normal"
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
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Core Support </Typography>
            <Typography
              variant="h6"
              className={classes.sectionTotalColor}
              inline
            >
              {" "}
              &nbsp;|&nbsp;Total: ${this.state.coreTotal}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Assistance with Daily Life
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("assistanceDaily")}
                  value={this.state.assistanceDaily}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.assistanceDaily}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Transport</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("transport")}
                  value={this.state.transport}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.transport}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Consumables</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("consumables")}
                  value={this.state.consumables}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.consumables}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Assistance with Social and Community Participation
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("assistanceSocial")}
                  value={this.state.assistanceSocial}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.assistanceSocial}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Capital</Typography>
            <Typography
              variant="h6"
              className={classes.sectionTotalColor}
              inline
            >
              {" "}
              &nbsp;|&nbsp;Total: ${this.state.capitalTotal}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">Assistive Technology</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("assistiveTechnology")}
                  value={this.state.assistiveTechnology}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.assistiveTechnology}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Home Modifications</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("homeModifications")}
                  value={this.state.homeModifications}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.homeModifications}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Capacity Building</Typography>
            <Typography
              variant="h6"
              className={classes.sectionTotalColor}
              inline
            >
              {" "}
              &nbsp;|&nbsp;Total: ${this.state.capacityTotal}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Coordination of Supports
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("coordinationSupport")}
                  value={this.state.coordinationSupport}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.coordinationSupport}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved Living Arrangements
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("livingArrangements")}
                  value={this.state.livingArrangements}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.livingArrangements}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Increased Social and Community Participation
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("communityParticipation")}
                  value={this.state.communityParticipation}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.communityParticipation}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Find and Keep a Job</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("employment")}
                  value={this.state.employment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.employment}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Relationships</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("relationships")}
                  value={this.state.relationships}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.relationships}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved Health and Wellbeing
                </Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("healthWellbeing")}
                  value={this.state.healthWellbeing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.healthWellbeing}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Learning</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("learning")}
                  value={this.state.learning}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.learning}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Life Choices</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("lifeChoices")}
                  value={this.state.lifeChoices}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.lifeChoices}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Daily Living</Typography>
                <ValidatedTextField
                  className={classes.number}
                  onChange={this.handleChange("dailyLiving")}
                  value={this.state.dailyLiving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  error={errors.dailyLiving}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
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
    );
  }
}

export default withStyles(styles)(FormPersonalDetails);
