import { toast } from 'react-toastify';
import { userConstants, urlConstants } from '../constants';
import { history } from '../helpers';

const fetchUser = () => async (dispatch) => {
  dispatch({ type: userConstants.FETCH_USER });
  let res = await fetch(urlConstants.FETCH_USER_URL);
  if (res.status === 200) {
    res = await res.json();
    dispatch({ type: userConstants.AUTH_USER, payload: res });
  } else {
    dispatch({ type: userConstants.UNAUTH_USER });
  }
};

const login = (email, password) => async (dispatch) => {
  dispatch({ type: userConstants.LOGIN_REQUEST });
  let res = await fetch(urlConstants.LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  if (res.status === 201) {
    res = await res.json();
    dispatch({ type: userConstants.AUTH_USER, payload: res.user });
    history.push('/');
  } else {
    toast('Login Failed!');
    dispatch({ type: userConstants.UNAUTH_USER });
  }
};

const register = (userInfo) => async (dispatch) => {
  dispatch({ type: userConstants.REGISTER_REQUEST });
  let { email, firstName, lastName, password, gender, birthDate } = userInfo;
  let params = { email, firstName, lastName, password, gender, birthDate };
  let res = await fetch(urlConstants.REGISTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(params)
  });
  if (res.status === 201) {
    res = await res.json();
    dispatch({ type: userConstants.AUTH_USER, payload: res.user });
    history.push('/');
  } else {
    toast('Registration Failed');
    dispatch({ type: userConstants.UNAUTH_USER });
  }
};

export const userActions = {
  login,
  // logout,
  register,
  fetchUser
};
