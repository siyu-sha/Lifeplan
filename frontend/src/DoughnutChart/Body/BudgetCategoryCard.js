import React, { Component } from "react";
import {
  Grid,
  Card,
  CardContent,
  Button,
  CardActions
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import CardHeader from "@material-ui/core/CardHeader";
import { Doughnut } from "react-chartjs-2";

const styles = {
  cardContainer: { width: 300 },
  cardHeader: { paddingBottom: 0, paddingTop: 0, height: 80 },
  cardContent: { paddingTop: 0, height: 80 }
};

class BudgetCategoryCard extends Component {
  render() {
    const {
      classes,
      category,
      allocated,
      total,
      allocatedColor,
      totalColor
    } = this.props;
    const available = total - allocated;
    console.log(total);
    console.log(allocated);
    console.log(available);
    return (
      <Card raised className={classes.cardContainer}>
        <CardHeader
          title={category}
          titleTypographyProps={{ variant: "h6" }}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Doughnut
            legend={{
              // display:false,
              position: "right",
              onClick: () => {}
            }}
            data={{
              labels: [`Allocated: $${allocated}`, `Available: $${available}`],
              datasets: [
                {
                  data: [allocated, available],
                  backgroundColor: [allocatedColor, totalColor]
                }
              ]
            }}
            options={{
              tooltips: { enabled: false }
            }}
          />
        </CardContent>
        <CardActions disableSpacing>
          <Grid container justify="flex-end">
            <Grid item>
              <Button size="small">View</Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(BudgetCategoryCard);
