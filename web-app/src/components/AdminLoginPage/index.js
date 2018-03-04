import React from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import TextField from 'material-ui/TextField'; import Button from 'material-ui/Button';
import { isEmpty } from 'lodash';
import { Redirect } from 'react-router-dom';
import { typeEmail, typePassword, login, openSnackbar } from '../../actions';
import { isEmail, minLength } from '../../utils/validate';

const styles = {
  container: {
    maxWidth: 400,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

class AdminLoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onPressLogin = this.onPressLogin.bind(this);
  }

  onChangeEmail(e) {
    this.props.typeEmail(e.target.value);
  }

  onChangePassword(e) {
    this.props.typePassword(e.target.value);
  }

  onPressLogin(e) {
    const {
      email,
      password,
      openSnackbar,
      login,
    } = this.props;
    e.preventDefault();

    if (isEmpty(email) || isEmpty(password)) {
      return openSnackbar('Email and password are required.');
    }

    if (!isEmail(email)) {
      return openSnackbar('Incorrect email address.');
    }

    if (!minLength(password, 6)) {
      return openSnackbar('Password must be at least 6 characters long.');
    }

    return login({ email, password });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/admin/events' } };
    const { email, password } = this.props;
    if (this.props.authenticated) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <Grid
          container
          direction="column"
          style={styles.container}
        >
          <Card>
            <CardContent>
              <TextField
                fullWidth
                id="email"
                label="email"
                value={email}
                margin="normal"
                onChange={this.onChangeEmail}
              />
              <TextField
                fullWidth
                type="password"
                id="password"
                value={password}
                label="password"
                margin="normal"
                onChange={this.onChangePassword}
              />
            </CardContent>
            <CardActions>
              <Button onClick={this.onPressLogin}fullWidth variant="raised" color="primary">
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { email, password, authenticated } = state.auth;
  return {
    email,
    password,
    authenticated,
  };
};

const mapDispatchToProps = {
  typeEmail,
  typePassword,
  login,
  openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLoginPage);
