import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Divider from "@material-ui/core/Divider";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/styles";
import { NAV_BAR_HEIGHT } from "../../common/theme";
import BudgetCategoryCard from "../../DoughnutChart/Body/BudgetCategoryCard";

const useStyles = makeStyles(theme => ({
  secondary: {
    backgroundColor: theme.palette.secondary.main
  },
  categoryIcon: {},
  expansionPanelSummary: {
    marginBottom: 0
  }
}));
export default function BudgetCategorySection(props) {
  const classes = useStyles();
  const { sectionName } = props;
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        classes={{ expanded: classes.expansionPanelSummary }}
        expandIcon={<ExpandMoreIcon color="secondary" />}
        aria-controls={sectionName + "content"}
        id={sectionName + "-header"}
      >
        <Grid container>
          <Grid item>
            <MonetizationOnIcon fontSize="large" color="secondary" />
          </Grid>
          <Grid item>
            <Typography variant="h5">{sectionName}</Typography>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Divider className={classes.secondary} />
          </Grid>
          <Grid item container spacing={2}>
            {props.children}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
