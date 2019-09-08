import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://lachieblack.com:8000/api/v1/"
    : "http://localhost:8000/api/v1/";


const setAccess = access => {
  if (access != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + access;
  } else {
    delete axios.defaults.headers.common["Authorization"];
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
  setAccess
};
