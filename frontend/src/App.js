import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Theme from "./theme/Theme";
import Home from "./home/Home";
import BudgetEdit from "./budget/edit/BudgetEdit.js";
import "./App.css";
import NavBar from "./common/NavBar";
import BudgetDashboard from "./budget/dashboard/BudgetDashboard";
import DoughnutChartPage from "./DoughnutChart/Body/DoughnutChartPage";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import { JWT } from "./common/constants";
import api from "./api";
import { LOAD_USER } from "./redux/actionTypes";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  loadUser: () => {
    dispatch({ type: LOAD_USER, payload: api.Participants.currentUser() });
  }
});

function App(props) {
  // get jwt from local storage on every app refresh
  useEffect(() => {
    const jwt = localStorage.getItem(JWT);
    if (jwt != null) {
      api.setToken(jwt);
      props.loadUser();
    }
  });

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
          <Route path="/authentication/signin" component={SignIn} />
          <Route path="/authentication/signup" component={SignUp} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
