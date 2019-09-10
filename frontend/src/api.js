import axios from "axios";
import {LocalStorageKeys} from "./common/constants";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://lachieblack.com:8000/api/v1/"
    : "http://localhost:8000/api/v1/";


// intercept 401 errors, and attempt to get new access token, otherwise redirect to signin
function set401Interceptor(on401){
  axios.interceptors.response.use(null,error => {
    if(error.response && error.response.status === 401 && error.config && error.response.data.code === "token_not_valid" && error.response.data.messages) {
      return Auth.refresh(localStorage.getItem(LocalStorageKeys.REFRESH))
        .then(refreshResponse => {
          const access = refreshResponse.data.access;
          const config = {...error.config, headers: {...error.headers, Authorization: "Bearer " + access}};
          setAccess(access);
          return axios.request(config);
        })
        .catch(() => {
          on401();
          return Promise.reject(error);
        });
    }
    else {
      return Promise.reject(error);
    }
  });
}


const setAccess = access => {
  if (access != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + access;
    localStorage.setItem(LocalStorageKeys.ACCESS, access);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem(LocalStorageKeys.ACCESS);

  }
};

const Auth = {
  login: ({ email, password }) => {
    return axios.post("/auth/login", {
      username: email,
      password
    });
  },
  // needs email, password, firstName, lastName, postcode, birthYear
  register: function({
    email,
    password,
    firstName,
    lastName,
    postcode,
    birthYear
  }) {
    return axios.post("/auth/register", arguments[0]);
  },
  refresh: (refresh) => {
    return axios.post("/auth/refresh", {refresh});
  }
};

const Participants = {
  currentUser: () => {
    return axios.get("participants/current-user");
  }
};

const SupportItems = {
  get: ({
    birthYear,
    postcode,
    supportCategoryID,
    registrationGroupID = null
  }) => {
    return axios.get(
      `/support-items?birth-year=${birthYear}&postcode=${postcode}&support-category-id=${supportCategoryID}&registration-groupid=${registrationGroupID}`
    );
  }
};

const SupportGroups = {
  all: () => {
    return axios.get("/support-groups");
  }
};

export default {
  Auth,
  Participants,
  SupportGroups,
  SupportItems,
  setAccess,
  set401Interceptor
};
