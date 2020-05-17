import { combineReducers } from 'redux'

const authReducer = (state = {auth: null, info: null}, action) => {
    switch(action.type) {
      case "LOGIN":
        return {
          auth: action.auth,
          info: action.info
        }
      case "LOGOUT":
        return {
          auth: null,
          info: null
        }
      default:
        return state;
    }
  };

export default authReducer

// export default combineReducers({
//     doc: docAuthReducer,
//     patient: patientAuthReducer
// })