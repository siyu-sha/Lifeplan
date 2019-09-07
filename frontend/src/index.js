import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { CustomTheme } from "./common/theme";
import Provider from "react-redux/es/components/Provider";
import store from "./redux/store";

ReactDOM.render(
  <MuiThemeProvider theme={CustomTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
