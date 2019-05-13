import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import DailyLivingChart from "./../Test/DailyLivingChart";
import { Button } from "@material-ui/core";

const styles = theme => ({
  card: {
    display: "flex",
    width: 350,
    height: 180
  },
  left: {
    display: "flex",
    flexDirection: "column",
    width: 125,
    margin: 0
  },

  right: {
    display: "flex",
    flexDirection: "column",
    margin: 0
  },

  bottom: {
    marginTop: 70,
    marginLeft: 150
  }
});

function LeftCard(props) {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <div className={classes.left}>
        <DailyLivingChart />
        <Typography color="textSecondary" fontSize="sm">
          $2000.00 left
        </Typography>
        <Typography color="Black">Total: $8000.00</Typography>
      </div>
      <div className={classes.right}>
        <CardContent className={classes.content}>
          <Typography component="h1" variant="h6">
            Assitance with daily living!
          </Typography>
          <div className={classes.bottom}>
            <Button component="span">View</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default withStyles(styles)(LeftCard);
