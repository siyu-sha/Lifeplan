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
import classNames from "classnames";

const styles = {
  cardHeader: { height: 80 },
  noVerticalPadding: { paddingTop: 0, paddingBottom: 0 }
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
    const available = Math.round(100 * (total - allocated)) / 100;
    return (
      <Card raised>
        <CardHeader
          title={category}
          titleTypographyProps={{ variant: "h6" }}
          className={classNames(classes.cardHeader, classes.noVerticalPadding)}
        />
        <CardContent className={classes.noVerticalPadding}>
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
        <CardActions disableSpacing className={classes.noVerticalPadding}>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={this.props.openSupports} size="small">
                View
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(BudgetCategoryCard);
