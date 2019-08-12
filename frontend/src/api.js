import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8000/api/v1/"
    : "http://localhost:8000/api/v1/";

const setToken = token => {
  if (token !== null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
};

const Auth = {
  login: ({ email, password }) => {
    axios.post("auth/login", {
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
    axios.post("auth/register", arguments[0]);
  }
};

const SupportItems = {
  get: ({
    birthYear,
    postcode,
    supportCategoryID,
    registrationGroupID = null
  }) => {
    axios.get(
      `support-items?birth-year=${birthYear}&postcode=${postcode}&support-category-id=${supportCategoryID}&registration-groupid=${registrationGroupID}`
    );
  }
};

const SupportGroups = {
  getAll: () => axios.get("support-groups")
};

export default {
  Auth,
  SupportGroups,
  SupportItems,
  setToken
};
