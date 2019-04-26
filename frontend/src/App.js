import React, { Component } from "react";
import { CustomTheme } from "./common/theme";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";

import "./App.css";
import NavBar from "./common/NavBar";

// required for makeStyles to work properly

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <nav>
          <NavBar />
        </nav>

        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/theme" component={Theme} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
