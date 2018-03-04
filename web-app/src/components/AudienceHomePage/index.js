import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input, { InputAdornment } from 'material-ui/Input';
import Grid from 'material-ui/Grid';
import { checkEventCode, openSnackbar } from '../../actions';

const styles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  input: {
    width: 280,
  },
};

// TODO: separate styles
class AudienceHomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
    this.onCodeInputChange = this.onCodeInputChange.bind(this);
    this.onInputPress = this.onInputPress.bind(this);
  }

  onCodeInputChange(event) {
    this.setState({ code: event.target.value });
  }

  onInputPress(event) {
    const { code } = this.state;
    if (code && event.key === 'Enter' && !this.props.isFetching) {
      this.props.checkEventCode(code);
    }
  }

  render() {
    const { eventCodeValided } = this.props;
    if (eventCodeValided) {
      return <Redirect to={`/event/${this.state.code}`} />;
    }
    return (
      <div>
        <Grid container style={styles.container}>
          <Grid item xs={12}>
            <Grid container justify="center" direction="row" alignItems="center">
              <Grid item >
                <Input
                  autoFocus
                  style={styles.input}
                  id="adornment-amount"
                  placeholder="Type event code and press enter"
                  startAdornment={<InputAdornment position="start">#</InputAdornment>}
                  value={this.state.code}
                  onChange={this.onCodeInputChange}
                  onKeyPress={this.onInputPress}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { eventCodeValided, isFetching } = state.eventRoom;
  return {
    isFetching,
    eventCodeValided,
  };
};

const mapDispatchToProps = {
  openSnackbar,
  checkEventCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(AudienceHomPage);
