import { combineReducers } from 'redux'

const authReducer = (state = {login: false, accountType: null}, action) => {
    switch(action.type) {
      case "LOGIN":
        return {
          login: true,
          accountType: action.accountType
        }
      case "LOGOUT":
        return {
          login: false
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