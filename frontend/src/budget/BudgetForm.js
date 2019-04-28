import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  paper: {
    width: 600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 16
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

class FormPersonalDetails extends React.Component {
  state = {
    postcode: 0,
    birth_year: 0,
    start_date: 0,
    assistance_daily: 0,
    transport: 0,
    consumables: 0,
    assistance_social: 0,
    assistive_technology: 0,
    home_modifications: 0,
    coordination_support: 0,
    living_arrangements: 0,
    community_participation: 0,
    employment: 0,
    relationships: 0,
    health_wellbeing: 0,
    learning: 0,
    life_choices: 0,
    daily_living: 0
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleNext = () => {
    /*go to next page*/
  };

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
                  required
                  type="number"
                  label="Postcode"
                  onChange={this.handleChange("postcode")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  label="Year of Birth"
                  onChange={this.handleChange("birth_year")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Core Support</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Assistance with daily life
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("assistance_daily")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Transport</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("transport")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Consumables</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("consumables")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Assistance with social and community participation
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("assistance_social")}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Capital</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">Assistive technology</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("assistive_technology")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Home modifications</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("home_modifications")}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Capacity Building</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Coordination of supports
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("coordination_support")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved living arrangements
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("living_arrangements")}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Increased social and community participation
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("community_participation")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Find and keep a job</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("employment")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved relationships</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("relationships")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">
                  Improved health and wellbeing
                </Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("health_wellbeing")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved learning</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("learning")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved life choices</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("life_choices")}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography variant="body1">Improved daily living</Typography>
                <TextField
                  type="number"
                  onChange={this.handleChange("daily_living")}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={this.handleNext}
        >
          Next
        </Button>
      </Paper>
    );
  }
}

export default withStyles(styles)(FormPersonalDetails);
