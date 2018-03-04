import {
  PASSWORD_CHANGED,
  EMAIL_CHANGED,
  LOGIN_SUCCESS,
  CHECK_LOGIN,
  CHECK_LOGIN_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  token: '',
  authenticated: false,
  isCheckingUserLogged: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };

    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };

    case CHECK_LOGIN:
      return { ...state, isCheckingUserLogged: true };

    case CHECK_LOGIN_SUCCESS:
      return { ...state, isCheckingUserLogged: false };

    case LOGIN_SUCCESS:
      return {
        ...state,
        INITIAL_STATE,
        authenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};
