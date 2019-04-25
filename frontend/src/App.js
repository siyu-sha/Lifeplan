import React, { Component } from "react";
import { CustomTheme } from "./common/CustomTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={CustomTheme}>
          <Switch>
            <Route exact path="/" component={Theme} />
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
