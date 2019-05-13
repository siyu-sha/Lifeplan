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
  "assistance_daily",
  "transport",
  "consumables",
  "assistance_social"
];
const capital_categories = ["assistive_technology", "home_modifications"];
const capacity_categories = [
  "coordination_support",
  "employment",
  "living_arrangements",
  "relationships",
  "health_wellbeing",
  "learning",
  "life_choices",
  "daily_living",
  "community_participation"
];

class FormPersonalDetails extends React.Component {
  state = {
    postcode: "",
    birth_year: "",
    start_date: "",
    assistance_daily: "",
    transport: "",
    consumables: "",
    assistance_social: "",
    assistive_technology: "",
    home_modifications: "",
    coordination_support: "",
    living_arrangements: "",
    community_participation: "",
    employment: "",
    relationships: "",
    health_wellbeing: "",
    learning: "",
    life_choices: "",
    daily_living: "",
    core_total: 0,
    capital_total: 0,
    capacity_total: 0
  };

  handleChange = input => e => {
    //this.setState({ [input]: e.target.value });
    console.log();
    var new_amount;
    if (e.target.value === "") {
      this.setState({ [input]: "" });
      new_amount = 0;
    } else {
      new_amount = Math.round(parseFloat(e.target.value) * 100) / 100;
      this.setState({ [input]: new_amount });
    }
    if (core_categories.includes(input)) {
      this.setState({
        core_total: this.addTotal(core_categories, new_amount, input)
      });
    } else if (capital_categories.includes(input)) {
      this.setState({
        capital_total: this.addTotal(capital_categories, new_amount, input)
      });
    } else if (capacity_categories.includes(input)) {
      this.setState({
        capacity_total: this.addTotal(capacity_categories, new_amount, input)
      });
    }
  };

  handleNext = () => {
    /*go to next page*/
  };

  //  adds up the total of a given budget section
  addTotal(categories, new_amount, changed) {
    var total = 0;
    for (var i = 0; i < categories.length; i++) {
      if (categories[i] === changed) {
        total += new_amount;
      } else if (this.state[categories[i]] !== "") {
        total += this.state[categories[i]];
      }
    }
    total = Math.round(total * 100) / 100;
    return total;
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Personally Details</Typography>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.number}
                  required
                  type="number"
                  label="Year of Birth"
                  onChange={this.handleChange("birth_year")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.number}
                  required
                  label="Start date"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
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
              &nbsp;|&nbsp;Total: ${this.state.core_total}
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
                  type="number"
                  onChange={this.handleChange("assistance_daily")}
                  value={this.state.assistance_daily}
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
                  type="number"
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
                  type="number"
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
                  Assistance with social and community participation
                </Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("assistance_social")}
                  value={this.state.assistance_social}
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
              &nbsp;|&nbsp;Total: ${this.state.capital_total}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">Assistive technology</Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("assistive_technology")}
                  value={this.state.assistive_technology}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Home modifications</Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("home_modifications")}
                  value={this.state.home_modifications}
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
              &nbsp;|&nbsp;Total: ${this.state.capacity_total}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Coordination of supports
                </Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("coordination_support")}
                  value={this.state.coordination_support}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved living arrangements
                </Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("living_arrangements")}
                  value={this.state.living_arrangements}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Increased social and community participation
                </Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("community_participation")}
                  value={this.state.community_participation}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Find and keep a job</Typography>
                <TextField
                  className={classes.number}
                  type="number"
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
                <Typography variant="body1">Improved relationships</Typography>
                <TextField
                  className={classes.number}
                  type="number"
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
                  Improved health and wellbeing
                </Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("health_wellbeing")}
                  value={this.state.health_wellbeing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved learning</Typography>
                <TextField
                  className={classes.number}
                  type="number"
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
                <Typography variant="body1">Improved life choices</Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("life_choices")}
                  value={this.state.life_choices}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved daily living</Typography>
                <TextField
                  className={classes.number}
                  type="number"
                  onChange={this.handleChange("daily_living")}
                  value={this.state.daily_living}
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
