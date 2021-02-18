import { userConstants } from '../constants';
const defaultState = {
  auth: null,
  user: {},
  loginRequest: false,
  registerRequest: false
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case userConstants.AUTH_USER:
      return {
        auth: true,
        user: { ...action.payload },
        loginRequest: false,
        registerRequest: false
      };
    case userConstants.UNAUTH_USER:
      return {
        auth: false,
        user: {},
        loginRequest: false,
        registerRequest: false
      };
    case userConstants.LOGIN_REQUEST:
      return {
        auth: false,
        loginRequest: true,
        registerRequest: false,
        user: {}
      };
    case userConstants.REGISTER_REQUEST:
      return {
        auth: false,
        loginRequest: false,
        registerRequest: true,
        user: {}
      };
    default:
      return state;
  }
};
export default userReducer;
