import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
//TODO: update this line to use @material-ui/styles
import { makeStyles } from "@material-ui/core/styles";
import { DARK_BLUE, LIGHT_BLUE, NAV_BAR_HEIGHT } from "../common/theme";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import { palette } from "@material-ui/system";

const useStyles = makeStyles(theme => ({
  home: {
    height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`
  },
  planPageSelector: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  budgetPageSelector: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main
  },
  pageSelector: {
    width: theme.spacing(16),
    height: theme.spacing(16)
  }
}));

export default function Home() {
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
                  Welcome.
                  <br />
                  Please select the tool you wish to use:
                </Typography>
              </Grid>

              {/*page navigation buttons */}
              <Grid item xs={12}>
                <Grid container justify="space-evenly">
                  <Grid item>
                    <Card raised>
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
                            Plan Creator
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Grid item>
                    <Card
                      raised
                      onClick={() => (window.location.href = "/budget/edit")}
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
      </Grid>
    </Grid>
  );
}
