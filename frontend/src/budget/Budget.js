import React from "react";
import Grid from "@material-ui/core/Grid";
import { NAV_BAR_HEIGHT } from "../common/theme";
import { makeStyles } from "@material-ui/styles";
import FormPersonalDetails from "./BudgetForm";

const useStyles = makeStyles({
  home: {
    height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`
  }
});

export default function BudgetForm() {
  const classes = useStyles();
  return (
    <Grid container className={classes.home}>
      <Grid item xs={12}>
        <FormPersonalDetails />
      </Grid>
    </Grid>
  );
}
