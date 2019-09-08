import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import reducer from "./reducer";
import { promiseMiddleware } from "./middleware";

const getMiddleware = () => {
  return applyMiddleware(promiseMiddleware);
};

export default createStore(reducer, composeWithDevTools(getMiddleware()));
