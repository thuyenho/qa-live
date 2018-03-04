import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import AdminEventReducer from './AdminEventReducer';
import SnackbarReducer from './SnackbarReducer';
import EventRoomReducer from './EventRoomReducer';

export default combineReducers({
  auth: AuthReducer,
  adminEvent: AdminEventReducer,
  snackbar: SnackbarReducer,
  eventRoom: EventRoomReducer,
});
