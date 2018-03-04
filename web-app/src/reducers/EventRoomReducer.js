import sortBy from 'lodash/sortBy';
import findBy from 'lodash/find';
import {
  CHECK_EVENT_CODE,
  CHECK_EVENT_CODE_FAILURE,
  CHECK_EVENT_CODE_SUCCESS,
  GET_EVENT_ROOM_SUCCESS,
  TYPE_QUESTION,
  TYPE_AUTHOR,
  SUBMIT_QUESTION,
  SUBMIT_QUESTION_SUCCESS,
  RECEIVE_NEW_QUESTION,
  VOTE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_UPDATED,
  QUESTION_SORT_CHANGED,
  RECEIVE_QUESTION_DELETED,
} from '../actions/types';

import calculateScore from '../utils/caculateScore';

const MAX_QUESTION_LENGTH = 160;

const INITIAL_STATE = {
  isFetching: false,
  eventRoom: null,
  question: '',
  charactersLeft: MAX_QUESTION_LENGTH,
  questions: [], // all questions users asked.
  author: '',
  codeChecked: false,
  eventCodeValided: false,

  // positiveSore sorted by most questions liked
  // createdDate sorted by recent questions
  questionsSortBy: 'positiveScore',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHECK_EVENT_CODE:
      return {
        ...state,
        isFetching: true,
        codeChecked: false,
      };

    case SUBMIT_QUESTION:
      return {
        ...state,
        isFetching: true,
      };

    case CHECK_EVENT_CODE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        codeChecked: true,
        eventCodeValided: true,
      };

    case SUBMIT_QUESTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        question: '',
        charactersLeft: MAX_QUESTION_LENGTH,
      };

    case RECEIVE_NEW_QUESTION:
      const questionExited = findBy(state.questions, o => o.id === action.payload.id);

      if (questionExited) {
        return state;
      }

      const questionAdded = calculateScore(action.payload);
      return {
        ...state,
        questions: [...state.questions, questionAdded],
      };

    case VOTE_QUESTION_SUCCESS:
    case RECEIVE_QUESTION_UPDATED:
      const questionUpdated = calculateScore(action.payload);
      return {
        ...state,
        questions: state.questions.map(question => (
          question.id === questionUpdated.id ? questionUpdated : question
        )),
      };

    case RECEIVE_QUESTION_DELETED:
      return {
        ...state,
        questions: state.questions.filter(question => (
          question.id !== action.payload.id
        )),
      };  

    case GET_EVENT_ROOM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        codeChecked: true,
        eventCodeValided: true,
        eventRoom: action.payload,
        questions: action.payload && sortBy(
          action.payload.questions.map(question => calculateScore(question)),
          [state.questionsSortBy]
        )
        .reverse(),
      };

    case CHECK_EVENT_CODE_FAILURE:
      return {
        ...state,
        codeChecked: true,
        isFetching: false,
      };

    case TYPE_QUESTION:
      return {
        ...state,
        question: action.payload,
        charactersLeft: MAX_QUESTION_LENGTH - action.payload.length,
      };

    case TYPE_AUTHOR:
      return {
        ...state,
        author: action.payload,
      };

    case QUESTION_SORT_CHANGED:
      return {
        ...state,
        questionsSortBy: action.payload,
        questions: sortBy(
          state.questions,
          [action.payload]
        )
        .reverse(),
      };

    default:
      return state;
  }
};
