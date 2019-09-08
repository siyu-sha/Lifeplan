import isPromise from 'is-promise';
import {LocalStorageKeys} from "../common/constants";
import api from "../api";
import axios from "axios";



// if 401, attempt to retry after retrieving new access toekn with refresh token, else fail
function promiseMiddleware( { dispatch }) {
  return next => action => {
    return (isPromise(action.payload)) ?
      action.payload
        .then(response => dispatch({ ...action, payload: response}))
        .catch(
          error => {
            console.log(error.response);
            console.log(action.history);
            if(error.response != null && action.history != null) {
              if (error.response.status === 401) {
                const data = error.response.data;
                if (error.config && data != null && data.code === "token_not_valid" && data.messages[0].tokenType === "access") {
                  api.Auth.refresh(localStorage.getItem(LocalStorageKeys.REFRESH))
                    .then(refreshResponse => {
                      const access = refreshResponse.data.access;
                      const config = {...error.config, headers: {...error.headers, Authorization: "Bearer " + access}};
                      api.setAccess(access);
                      localStorage.setItem(LocalStorageKeys.ACCESS, access);
                      dispatch({...action, payload:axios.request(config)});

                    })
                    .catch(() => action.history.push("/signin"));
                }
                else {
                  action.history.push("/signin");
                }
              }
            }
          })
      : next(action);
  }
}

export { promiseMiddleware }