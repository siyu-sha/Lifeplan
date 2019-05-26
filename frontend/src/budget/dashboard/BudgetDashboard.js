import React from "react";
import BudgetCategorySection from "./BudgetCategorySection";
import Grid from "@material-ui/core/Grid";

export default function BudgetDashBoard() {
  return (
    <Grid container justify="center">
      <Grid item xs={11} sm={10} md={9} lg={8}>
        <BudgetCategorySection sectionName="Core Supports" color="red" />
      </Grid>
    </Grid>
  );
}
