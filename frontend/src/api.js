import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8000/api/v1/"
    : "http://localhost:8000/api/v1/";

const setToken = () => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("access");
};

const Auth = {
  login: request => {
    axios.post("auth/login", {
      username: request.email,
      password: request.password
    });
  },
  // needs email, password, firstName, lastName, postcode, birthYear
  register: request => {
    axios.post("auth/register", { ...request });
  }
};
