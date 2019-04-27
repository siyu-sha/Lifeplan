import "./installTheme";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./installTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { CustomTheme } from "./common/theme";

ReactDOM.render(
  <MuiThemeProvider theme={CustomTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
