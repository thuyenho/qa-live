import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from '../actions/types';

const INITIAL_STATE = {
  isOpen: false,
  message: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return { ...state, isOpen: true, message: action.payload };

    case CLOSE_SNACKBAR:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};
