import React from 'react';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { getEventList, createEvent, openSnackbar } from '../../actions';
import EventItem from './EventItem';

const styles = {
  container: {
    margin: '0 auto',
    paddingTop: 40,
    maxWidth: 800,
  },
  cardHeader: {
    width: '100%',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  buttonDescription: {
    marginLeft: 10,
  },
};

class AdminDashboardPage extends React.Component {
  constructor(props) {
    super(props);
    // TODO: move this state to reducer instead
    this.state = {
      openCreateEventForm: false,
      name: '',
      code: '',
      startDate: moment().toISOString().split('T')[0],
      endDate: moment().toISOString().split('T')[0],
    };

    this.onPressCreate = this.onPressCreate.bind(this)
    this.handleCloseCreateEventForm = this.handleCloseCreateEventForm.bind(this);
    this.onChangeTextField = this.onChangeTextField.bind(this);
    this.onCreateEvent = this.onCreateEvent.bind(this);
  }

  componentDidMount() {
    if (!this.props.isFetching) {
      this.props.getEventList();
    }
  }

  onPressCreate() {
    this.setState({ openCreateEventForm: true });
  }

  onChangeTextField({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  onCreateEvent() {
    const {
      code,
      name,
      startDate,
      endDate,
    } = this.state;

    if (!code || !name || !startDate || !endDate) {
      return this.props.openSnackbar('All fields are required.');
    }
    this.handleCloseCreateEventForm();

    return this.props.createEvent({
      name,
      code,
      startDate,
      endDate,
    });
  }

  handleCloseCreateEventForm() {
    this.setState({ openCreateEventForm: false });
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.openCreateEventForm}
          onClose={this.handleCloseCreateEventForm}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create new event</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              value={this.state.name}
              onChange={this.onChangeTextField}
            />
            <TextField
              fullWidth
              margin="dense"
              id="eventCode"
              name="code"
              label="Code"
              type="text"
              value={this.state.code}
              onChange={this.onChangeTextField}
            />
            <TextField
              fullWidth
              id="date"
              label="start"
              name="startDate"
              type="date"
              defaultValue={this.state.startDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.onChangeTextField}
            />
            <TextField
              fullWidth
              id="date"
              label="end"
              name="endDate"
              type="date"
              defaultValue={this.state.endDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.onChangeTextField}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseCreateEventForm} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onCreateEvent} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Grid
          container
          direction="column"
          style={styles.container}
        >
          <Grid item>
            <Button variant="fab" color="primary" onClick={this.onPressCreate}>
              <AddIcon />
            </Button>
            <span style={styles.buttonDescription}>Create new event</span>
          </Grid>
          
          <Grid item>
            <Card>
              {this.props.events.map(eventItem => (
                <EventItem key={eventItem.id} eventItem={eventItem} />
              ))}
            </Card>
          </Grid>

        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { events, isFetching } = state.adminEvent;
  return {
    isFetching,
    events,
  };
};

const mapDispatchToProps = {
  openSnackbar,
  getEventList,
  createEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboardPage);
