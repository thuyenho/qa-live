import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import { checkLogin } from '../actions';

const styles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      this.props.checkLogin();
    }

    render() {
      if (this.props.isCheckingUserLogged) {
        return <CircularProgress style={styles.container} />;
      }

      if (!this.props.authenticated) {
        return (
          <Redirect
            to={{
              pathname: '/admin/login',
              state: { from: this.props.location },
            }}
          />);
      }

      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    const { authenticated, isCheckingUserLogged } = state.auth;
    return { authenticated, isCheckingUserLogged };
  };

  return connect(mapStateToProps, { checkLogin })(Authentication);
}
