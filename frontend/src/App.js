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
import { LocalStorageKeys } from "./common/constants";
import api from "./api";
import { LOAD_USER } from "./redux/actionTypes";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  loadUser: (history) => {
    dispatch({ type: LOAD_USER, payload: api.Participants.currentUser(), history:history});
  }
});

function App(props) {
  // get jwt from local storage on every app refresh
  useEffect(() => {
    const access = localStorage.getItem(LocalStorageKeys.ACCESS);
    if (access != null) {
      api.setAccess(access);
      props.loadUser(props.history);
    }
  }, []);

  return (
    <div>
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
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </main>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
