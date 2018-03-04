import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { closeSnackbar } from '../../actions';

class CustomSnackbar extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.closeSnackbar();
  }

  render() {
    const { isOpen, message } = this.props;
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        open={isOpen}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { isOpen, message } = state.snackbar;
  return {
    isOpen,
    message,
  };
};

const mapDispatchToProps = {
  closeSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomSnackbar);
