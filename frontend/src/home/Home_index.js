import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { NAV_BAR_HEIGHT } from "../common/theme";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  home: {
    height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`,
  },
  planPageSelector: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  budgetPageSelector: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  pageSelector: {
    width: theme.spacing(20),
    height: theme.spacing(16),
  },
}));

export default function Home_index() {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" className={classes.home}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={11}>
            <Grid container spacing={4}>
              {/* welcome text */}
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                      Welcome to Capital Guardian Budget Planner.
                  <br />I want to use:
                </Typography>
              </Grid>

              {/*page navigation buttons */}
              <Grid item xs={12}>
                <Grid container justify="space-evenly"  >
                  <Grid item >
                    <Card
                      raised
                      onClick={() =>
                        (window.location.href = "/hcp/budget/edit")
                      }
                    >
                      <CardActionArea
                        className={classNames(
                          classes.planPageSelector,
                          classes.pageSelector
                        )}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            align="center"
                            color="inherit"
                          >
                            Home Care Package Budget
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Grid item>
                    <Card
                      raised
                      onClick={() =>
                        (window.location.href = "/ndis/home")
                      }
                    >
                      <CardActionArea
                        className={classNames(
                          classes.budgetPageSelector,
                          classes.pageSelector
                        )}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            align="center"
                            color="inherit"
                          >
                            NDIS Budget
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
      </Grid>
    </Grid>
  );
}
