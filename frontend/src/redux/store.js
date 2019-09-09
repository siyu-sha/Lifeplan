import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import reducer from "./reducer";

const getMiddleware = () => {
  return applyMiddleware();
};

export default createStore(reducer, composeWithDevTools(getMiddleware()));
