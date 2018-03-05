/* global io */
import {
  CHECK_EVENT_CODE,
  CHECK_EVENT_CODE_SUCCESS,
  CHECK_EVENT_CODE_FAILURE,
  GET_EVENT_ROOM_SUCCESS,
  SUBMIT_QUESTION,
  TYPE_QUESTION,
  TYPE_AUTHOR,
  SUBMIT_QUESTION_SUCCESS,
  RECEIVE_NEW_QUESTION,
  VOTE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_UPDATED,
  QUESTION_SORT_CHANGED,
  RECEIVE_QUESTION_DELETED,
} from './types';
import client from '../client';
import { showError } from './CommonActions.js';

export const checkingEventCode = () => ({
  type: CHECK_EVENT_CODE,
});

export const questionSortChanged = (fieldUsed) => ({
  type: QUESTION_SORT_CHANGED,
  payload:fieldUsed,
});

export const submitingQuestion = () => ({
  type: SUBMIT_QUESTION,
});

export const checkEventCodeSuccess = (dispatch) => {
  dispatch({
    type: CHECK_EVENT_CODE_SUCCESS,
  });
};

export const getEventRoomSuccess = (dispatch, response) => {
  const { eventRoom, sessionId } = response;
  localStorage.setItem('userSessionId', sessionId);
  dispatch({
    type: GET_EVENT_ROOM_SUCCESS,
    payload: eventRoom,
  });
};

export const submitQuestionSuccess = (dispatch) => {
  dispatch({
    type: SUBMIT_QUESTION_SUCCESS,
  });
};

export const voteQuestionSuccess = (dispatch, data) => {
  dispatch({
    type: VOTE_QUESTION_SUCCESS,
    payload: data,
  });
};

export const receiveQuestionUpdated = (dispatch, data) => {
  dispatch({
    type: RECEIVE_QUESTION_UPDATED,
    payload: data,
  });
};

export const receiveQuestionDeleted = (dispatch, data) => {
  dispatch({
    type: RECEIVE_QUESTION_DELETED,
    payload: data,
  });
};

export const checkEventCodeFailure = (dispatch) => {
  dispatch({
    type: CHECK_EVENT_CODE_FAILURE,
  });
};

export const typeQuestion = (content) => ({
  type: TYPE_QUESTION,
  payload: content,
});

export const typeAuthor = (author) => ({
  type: TYPE_AUTHOR,
  payload: author,
});

export const checkEventCode = code => (dispatch) => {
  dispatch(checkingEventCode());
  client.get(`/api/event?code=${code}`)
    .then(() => {
      checkEventCodeSuccess(dispatch);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
      checkEventCodeFailure(dispatch);
    });
};

export const getEventRoom = code => (dispatch) => {
  dispatch(checkingEventCode());
  io.socket.get(`/api/event?code=${code}`, (response) => {
    if (response.status === 'error') {
      checkEventCodeFailure(dispatch);
    }
    listenQuestionAdded(dispatch);
    listenQuestionUpdated(dispatch);
    listenQuestionDeleted(dispatch);
    getEventRoomSuccess(dispatch, response);
  });
};

export const submitQuestion = ({ content, author, eventCode }) => (dispatch) => {
  dispatch(submitingQuestion());
  client.post('/api/submit-question', { content, author, eventCode })
    .then(() => {
      submitQuestionSuccess(dispatch);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};

export const leaveEventRoom = eventCode => (dispatch) => {
  io.socket.get(`/api/leave-event-room?eventCode=${eventCode}`, (response) => {
    console.log('LEAVED EVENT ROOM:' + response);
  });
};

export const receiveNewQuestion = (dispatch, data) => {
  dispatch({
    type: RECEIVE_NEW_QUESTION,
    payload: data,
  });
};

export const voteQuestion = ({ questionId, eventCode, score }) => (dispatch) => {
  io.socket.post('/api/vote', { questionId, eventCode, score }, (data) => {
    voteQuestionSuccess(dispatch, data);
  });
};

export const editQuestion = ({ questionId, eventCode, content }) => (dispatch) => {
  client.put('/api/admin/event/edit-question', { questionId, eventCode, content })
    .then(() => {
      // editQuestionSuccess(dispatch);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};

export const deleteQuestion = ({ questionId, eventCode }) => (dispatch) => {
  client.post('/api/admin/event/delete-question', { questionId, eventCode })
    .then(() => {
      //deleteQuestionQuestionSuccess(dispatch);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};

export const stareQuestion = ({ questionId, eventCode, stared }) => (dispatch) => {
  client.put('/api/admin/event/stare-question', { questionId, eventCode, stared })
    .then(() => {
      // apiSuccess(dispatch);
    })
    .catch(({ response }) => {
      showError(dispatch, response);
    });
};

const listenQuestionAdded = (dispatch) => {
  io.socket.on('SOCKET_EVENT_NEW_QUESTION_ADDED', (data) => {
    receiveNewQuestion(dispatch, data);
  });
};

const listenQuestionUpdated = (dispatch) => {
  io.socket.on('SOCKET_EVENT_QUESTION_UPDATED', (data) => {
    receiveQuestionUpdated(dispatch, data);
  });
};

const listenQuestionDeleted = (dispatch) => {
  io.socket.on('SOCKET_EVENT_QUESTION_DELETED', (data) => {
    receiveQuestionDeleted(dispatch, data);
  });
};
