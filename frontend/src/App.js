import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home_index from "./home/Home_index";
import Home from "./home/Home";
import BudgetEdit from "./budget/edit/BudgetEdit.js";
import hcp_BudgetEdit from "./budget/edit/hcp_BudgetEdit.js";
import "./App.css";
import NavBar from "./common/NavBar";
import Ndis_NavBar from "./common/ndis_NavBar";
import Hcp_NavBar from "./common/hcp_NavBar";
import BudgetDashboard from "./budget/dashboard/BudgetDashboard";
import hcp_BudgetDashboard from "./budget/dashboard/hcp_BudgetDashboard";
import BudgetAdd from "./budget/add/BudgetAdd";
import hcp_BudgetAdd from "./budget/add/hcp_BudgetAdd";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import Profile from "./home/Profile";
import hcp_Profile from "./home/hcp_Profile";
import { LocalStorageKeys } from "./common/constants";
import api from "./api";
import { connect } from "react-redux";
import { loadUser } from "./redux/reducers/auth";
import ForgotPassword from "./authentication/ForgotPassword";
import ResetPassword from "./authentication/ResetPassword";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  loadUser: (user) => {
    dispatch(loadUser(user));
  },
});

async function fetchUser(loadUser) {
  const response = await api.Participants.currentUser();
  loadUser(response.data);
}

function App(props) {
  // 01/05/2020: reset localstorage
  useEffect(() => {
    const reset = localStorage.getItem("reset");
    if (reset == null || new Date(reset) < 1588326307865) {
      localStorage.clear();
      const today = new Date();
      localStorage.setItem("reset", today.toString());
    }
  });

  useEffect(() => {
    // redirect if 401
    api.set401Interceptor(handle401);
    // set access token
    const access = localStorage.getItem(LocalStorageKeys.ACCESS);
    if (access != null) {
      api.setAccess(access);

      fetchUser(props.loadUser);

      // await api.Participants.currentUser().then(response => {
      //   props.loadUser(response.data);
      // });
    }
  });

  function handle401() {
    localStorage.removeItem(LocalStorageKeys.ACCESS);
    localStorage.removeItem(LocalStorageKeys.REFRESH);
    props.history.push("/signin");
    props.loadUser(null);
  }

  return (
    <div>

        <Switch>
          <Route path="/hcp" component={Hcp_NavBar} />
          <Route path="/ndis" component={Ndis_NavBar} />
          <Route exact component={NavBar} />
        </Switch>

      <main>
        <Switch>
          <Route exact path="/" component={Home_index} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />

          <Route path="/hcp/profile" component={hcp_Profile} />
          <Route path="/hcp/budget/edit" component={hcp_BudgetEdit} />
          <Route path="/hcp/budget/add" component={hcp_BudgetAdd} />
          <Route path="/hcp/budget/dashboard" component={hcp_BudgetDashboard} />


          <Route path="/profile" component={Profile} />
          <Route path="/ndis/home" component={Home} />
          <Route path="/ndis/budget/add" component={BudgetAdd} />
          <Route path="/ndis/budget/edit" component={BudgetEdit} />
          <Route path="/ndis/budget/dashboard" component={BudgetDashboard} />
        </Switch>
      </main>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
