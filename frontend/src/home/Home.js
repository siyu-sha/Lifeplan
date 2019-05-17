import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/styles";
import { DARK_BLUE, LIGHT_BLUE, NAV_BAR_HEIGHT } from "../common/theme";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";

const useStyles = makeStyles({
  home: {
    height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`
  },
  planPageSelector: {
    backgroundColor: DARK_BLUE,
    color: "white"
  },
  budgetPageSelector: {
    background: LIGHT_BLUE,
    color: DARK_BLUE
  },
  pageSelector: {
    width: 140,
    height: 140,
    textAlign: "center",
    display: "flex",
    alignItems: "center"
  },
  cardContainer: {
    marginTop: 40,
    marginLeft: "10vw",
    marginRight: "10vw"
  }
});

export default function Home() {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" className={classes.home}>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Welcome.
              <br />
              Please select the tool you wish to use:
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <Card raised className={classes.cardContainer}>
                  <CardActionArea
                    className={classNames(
                      classes.planPageSelector,
                      classes.pageSelector
                    )}
                  >
                    <CardContent>
                      <Typography variant="h6" align="center" color="inherit">
                        Plan Creator
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid item>
                <Card
                  raised
                  className={classes.cardContainer}
                  onClick={() => (window.location.href = "/budget")}
                >
                  <CardActionArea
                    className={classNames(
                      classes.budgetPageSelector,
                      classes.pageSelector
                    )}
                  >
                    <CardContent>
                      <Typography variant="h6" align="center" color="inherit">
                        Plan Budget Calculator
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
