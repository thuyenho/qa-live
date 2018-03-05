import { openSnackbar } from './SnackbarActions';

export const showError = (dispatch, response) => {
  const errorMsg = response.data.message ? response.data.message : 'An error occurs.';
  dispatch(openSnackbar(errorMsg));
};