import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";
import BudgetEdit from "./budget/edit/BudgetEdit.js";
import "./App.css";
import NavBar from "./common/NavBar";
import BudgetDashboard from "./budget/dashboard/BudgetDashboard";

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
            <Route path="/budget/edit" component={BudgetEdit} />
            <Route path="/budget/dashboard" component={BudgetDashboard} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
