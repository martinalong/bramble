const authReducer = (state = {authenticated: false}, action) => {
    switch(action.type) {
      case "LOGIN":
        return {
          authenticated: action.id
        }
      case "LOGOUT":
        return {
          authenticated: false
        }
      default:
        return state;
    }
  };

export default authReducer