import {LOAD_USER} from "../actionTypes";


const defaultState = {
  currentUser:null,
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case LOAD_USER:
      return {
        ...state,
        currentUser: action.payload.data
      };
    default:
      return state

  }
}