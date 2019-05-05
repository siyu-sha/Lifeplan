import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";

import "./App.css";
import NavBar from "./common/NavBar";

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
