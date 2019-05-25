import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button, CardActions } from "@material-ui/core";

const styles = theme => ({
  card: {
    flexDirection: "row",
    display: "flex",
    width: 500,
    height: 180
  },
  rightPart: {
    height: 0,
    marginTop: 0
  },
  content: {
    marginTop: 50,
    marginLeft: 0
  },
  title: {
    marginTop: 0,
    marginLeft: 0
  },

  chart: {
    display: "flex",
    flexDirection: "column",
    width: 250,
    marginLeft: 0
  },
  cardAction: {}
});

function DoughnutCard(props) {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <div className={classes.chart}>
        chart here
        <CardContent className={classes.content}>
          <Typography color="textSecondary">${props.amount} left</Typography>
          <Typography color="Black">Total: ${props.totalAmount}</Typography>
        </CardContent>
      </div>
      <div className={classes.rightPart}>
        <CardContent className={classes.title}>
          <Typography component="h1" variant="h6">
            {props.title}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardAction}>
          <Button component="span">View</Button>
        </CardActions>
      </div>
    </Card>
  );
}

export default withStyles(styles)(DoughnutCard);
