import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { NAV_BAR_HEIGHT } from "./theme";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";

const navBarStyles = makeStyles({
  navBar: {
    height: NAV_BAR_HEIGHT
  },
  grow: {
    flexGrow: 1
  }
});

export default function NavBar() {
  const classes = navBarStyles();
  return (
    <AppBar position="static">
      <Toolbar className={classes.navBar}>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          NDIS Tools
        </Typography>
        <Button href="/" color="inherit">
          Home
        </Button>
        <Button href="/theme" color="inherit">
          Theme
        </Button>
        <Button href="/DoughnutChart/Body/DoughnutChart" color="inherit">
          DoughnutChart
        </Button>
      </Toolbar>
    </AppBar>
  );
}
