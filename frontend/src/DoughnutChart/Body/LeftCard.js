import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button, CardActions } from "@material-ui/core";
import Chartjs from "../Test/Chartjs";

const styles = theme => ({
  card: {
    display: "flex",
    width: 350,
    height: 180
  },
  left: {
    display: "flex",
    flexDirection: "column",
    width: 300,
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
        <Chartjs />
        <Typography color="textSecondary" fontSize="sm">
          {props.amountLeft} left
        </Typography>
        <Typography color="Black">Total: {props.amoutTotal}</Typography>
      </div>
      <div className={classes.right}>
        <CardContent className={classes.content}>
          <Typography component="h1" variant="h6">
            {props.title}
          </Typography>
          <CardActions className={classes.bottom}>
            <Button component="span">View</Button>
          </CardActions>
        </CardContent>
      </div>
    </Card>
  );
}

export default withStyles(styles)(LeftCard);
