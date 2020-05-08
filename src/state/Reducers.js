import { combineReducers } from 'redux'

const docAuthReducer = (state = {docAuth: null}, action) => {
    switch(action.type) {
      case "DOC_LOGIN":
        return {
          docAuth: action.id
        }
      case "DOC_LOGOUT":
        return {
          docAuth: null
        }
      default:
        return state;
    }
  };

const patientAuthReducer = (state = {patientAuth: null}, action) => {
    switch(action.type) {
      case "PATIENT_LOGIN":
        return {
          patientAuth: action.id
        }
      case "PATIENT_LOGOUT":
        return {
            patientAuth: null
        }
      default:
        return state;
    }
  };

export default combineReducers({
    doc: docAuthReducer,
    patient: patientAuthReducer
})