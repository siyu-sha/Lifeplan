import React from "react";
import BudgetCategoryCard from "./BudgetCategoryCard";
import Grid from "@material-ui/core/Grid";

export default function DoughnutChartPage() {
  return (
    <Grid container justify={"center"}>
      <Grid item xs={11}>
        <Grid container spacing={2} justify={"center"}>
          <Grid item>
            <BudgetCategoryCard
              category={"Assistance with social and community participantion"}
              total={1000}
              allocated={300}
              allocatedColor="red"
              totalColor="blue"
            />
          </Grid>
          <Grid item>
            <BudgetCategoryCard
              category={"Assistance with daily living"}
              total={1000}
              allocated={300}
              allocatedColor="red"
              totalColor="blue"
            />
          </Grid>
          <Grid item>
            <BudgetCategoryCard
              category={"Core supports"}
              total={1000}
              allocated={300}
              allocatedColor="red"
              totalColor="blue"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
