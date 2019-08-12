import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";
import BudgetEdit from "./budget/edit/BudgetEdit.js";
import SupportsPopup from "./budget/dashboard/SupportsPopup";
import "./App.css";
import NavBar from "./common/NavBar";
import BudgetDashboard from "./budget/dashboard/BudgetDashboard";
import DoughnutChartPage from "./DoughnutChart/Body/DoughnutChartPage";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import SupportItemSelector from "./budget/dashboard/SupportItemSelector";

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
            <Route
              path="/DoughnutChart/Body/DoughnutChart"
              component={DoughnutChartPage}
            />
            <Route path="/supports" component={SupportsPopup} />
            <Route path="/authentication/signin" component={SignIn} />
            <Route path="/authentication/signup" component={SignUp} />

            <Route
              patth="/support-item-selector"
              component={SupportItemSelector}
            />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
