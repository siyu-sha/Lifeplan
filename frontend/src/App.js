import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";
import Budget from "./budget/Budget.js";
import "./App.css";
import NavBar from "./common/NavBar";
import SignIn from "./authentication/SignIn";

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
            <Route path="/budget" component={Budget} />
            <Route path="/authentication/signin" component={SignIn} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
