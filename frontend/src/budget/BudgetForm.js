import React from "react";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
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

var regex = new RegExp(/^-?\d*\.?\d{0,2}$/);

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
    if (regex.test(e.target.value)) {
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
    return (
      <Paper className={classes.paper}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Personal Details</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TextField
                  className={classes.number}
                  required
                  type="number"
                  label="Postcode"
                  onChange={this.handleChange("postcode")}
                  value={this.state.postcode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.number}
                  required
                  type="number"
                  label="Year of Birth"
                  onChange={this.handleChange("birthYear")}
                  value={this.state.birthYear}
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
                  Assistance with daily life
                </Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("assistanceDaily")}
                  value={this.state.assistanceDaily}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Transport</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("transport")}
                  value={this.state.transport}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Consumables</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("consumables")}
                  value={this.state.consumables}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Assistance with Social and Community Participation
                </Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("assistanceSocial")}
                  value={this.state.assistanceSocial}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
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
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("assistiveTechnology")}
                  value={this.state.assistiveTechnology}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Home Modifications</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("homeModifications")}
                  value={this.state.homeModifications}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
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
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("coordinationSupport")}
                  value={this.state.coordinationSupport}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved Living Arrangements
                </Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("livingArrangements")}
                  value={this.state.livingArrangements}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Increased Social and Community Participation
                </Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("communityParticipation")}
                  value={this.state.communityParticipation}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Find and Keep a Job</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("employment")}
                  value={this.state.employment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Relationships</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("relationships")}
                  value={this.state.relationships}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved Health and Wellbeing
                </Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("healthWellbeing")}
                  value={this.state.healthWellbeing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Learning</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("learning")}
                  value={this.state.learning}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Life Choices</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("lifeChoices")}
                  value={this.state.lifeChoices}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved Daily Living</Typography>
                <TextField
                  className={classes.number}
                  onChange={this.handleChange("dailyLiving")}
                  value={this.state.dailyLiving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
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
