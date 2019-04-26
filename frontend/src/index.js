import { install } from "./installTheme";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./installTheme";
import { DARK_BLUE, LIGHT_BLUE } from "./common/theme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CustomTheme } from "./common/theme";

ReactDOM.render(
  <MuiThemeProvider theme={CustomTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
