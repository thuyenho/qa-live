import client from '../client';
import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_SUCCESS,
  CHECK_LOGIN,
  CHECK_LOGIN_SUCCESS,
} from './types';
import { openSnackbar } from './SnackbarActions';

export const typeEmail = email => ({
  type: EMAIL_CHANGED,
  payload: email,
});

export const typePassword = password => ({
  type: PASSWORD_CHANGED,
  payload: password,
});

export const loginSuccess = (dispatch, data) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: data,
  });
};

export const checkingLogin = (dispatch) => {
  dispatch({
    type: CHECK_LOGIN,
  });
};

export const checkLoginSuccess = (dispatch) => {
  dispatch({
    type: CHECK_LOGIN_SUCCESS,
  });
};

export const login = ({ email, password }) => async (dispatch) => {
  client.post('/api/sign-in', { email, password })
    .then((response) => {
      loginSuccess(dispatch, response.data);
    })
    .catch(({ response }) => {
      const errorMsg = response.data ? response.data.message : 'An error occurs.';
      dispatch(openSnackbar(errorMsg));
    });
};

export const checkLogin = () => async (dispatch) => {
  checkingLogin(dispatch);
  client.get('/api/me')
    .then((response) => {
      checkLoginSuccess(dispatch);
      loginSuccess(dispatch, response.data);
    })
    .catch(() => {
      checkLoginSuccess(dispatch);
      // TODO: Force user to logout
    });
};
