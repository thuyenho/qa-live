import {
  GET_EVENT,
  GET_EVENT_SUCCESS,
  CREATE_EVENT,
  CREATE_EVENT_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  isFetching: false,
  events: [],
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EVENT:
    case CREATE_EVENT:
      return {
        ...state,
        isFetching: true,
      };

    case GET_EVENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        events: action.payload,
      };

    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        events: [action.payload, ...state.events],
      };

    default:
      return state;
  }
};
