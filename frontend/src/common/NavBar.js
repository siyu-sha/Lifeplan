import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          NDIS Plan Creator and Budgeting Tool
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
