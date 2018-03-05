import {
  GET_EVENT,
  GET_EVENT_SUCCESS,
  CREATE_EVENT,
  CREATE_EVENT_SUCCESS,
} from './types';
import client from '../client';
import { showError } from './CommonActions.js';

export const getEventListSuccess = (dispatch, data) => {
  dispatch({
    type: GET_EVENT_SUCCESS,
    payload: data,
  });
};

export const createSuccess = (dispatch, data) => {
  dispatch({
    type: CREATE_EVENT_SUCCESS,
    payload: data,
  });
};

export const getEventList = () => async (dispatch) => {
  dispatch({
    type: GET_EVENT,
  });
  client.get('/api/admin/event')
    .then((response) => {
      getEventListSuccess(dispatch, response.data);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};

export const createEvent = ({ name, code, startDate, endDate }) => async (dispatch) => {
  dispatch({
    type: CREATE_EVENT,
  });
  client.post('/api/admin/event', { name, code, startDate, endDate })
    .then((response) => {
      createSuccess(dispatch, response.data);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};
