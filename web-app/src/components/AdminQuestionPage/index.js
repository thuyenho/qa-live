import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import AdminQuestionItem from './AdminQuestionItem';
import {
  getEventRoom,
  leaveEventRoom,
  typeQuestion,
  submitQuestion,
  voteQuestion,
  editQuestion,
  deleteQuestion,
  stareQuestion,
  openSnackbar,
} from '../../actions';

const styles = {
  header: {
    marginLeft: 20,
    marginTop: 20,
  },
  card: {
  },
  media: {
    height: 200,
  },
  container: {
    margin: '0 auto',
    maxWidth: 600,
  },
  avatar: {
  },
  button: {
    float: 'right',
  },
  thumb: {
    marginLeft: 5,
  },
  thumbUp: {
    marginLeft: 10,
  },
  characterCounter: {
    textAlign: 'right',
    opacity: 0.4,
  },
  stared: {
    color: '#ffca26',
  },
};

class AdminQuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditQuestion = this.handleEditQuestion.bind(this);
    this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
    this.handleStareQuestion = this.handleStareQuestion.bind(this);
  }

  componentWillMount() {
    const { match, getEventRoom } = this.props;
    getEventRoom(match.params.eventCode);
  }

  componentWillUnmount() {
    const { eventRoom, leaveEventRoom } = this.props;
    // User joine event room
    if (eventRoom) {
      leaveEventRoom(eventRoom.code);
    }
  }

  handleDeleteQuestion(questionId) {
    const { eventRoom } = this.props;
    const eventCode = eventRoom.code;
    this.props.deleteQuestion({ questionId, eventCode });
  }

  handleStareQuestion(question) {
    const { eventRoom } = this.props;
    const eventCode = eventRoom.code;
    const { id, highlighted } = question;
    const stared = !highlighted;
    const questionId = id;
    this.props.stareQuestion({ questionId, eventCode, stared });
  }

  handleEditQuestion(questionId, content) {
    const { eventRoom } = this.props;
    const eventCode = eventRoom.code;
    this.props.editQuestion({ questionId, eventCode, content });
  }

  render() {
    const {
      codeChecked,
      questions,
      eventCodeValided,
    } = this.props;

    // TODO: Should return 404 page.
    if (codeChecked && !eventCodeValided) {
      return <Redirect to="/404" />;
    }

    if (!codeChecked) {
      return (<div>Loading...</div>);
    }

    return (
      <Grid
        container
        direction="column"
        style={styles.container}
      >
        {questions && !questions.length && <div>There is no question now.</div>}
        <Grid item xs={12}>
          <Card style={styles.card}>
            {questions.map(question => (
              <AdminQuestionItem
                key={question.id}
                question={question}
                handleEditQuestion={this.handleEditQuestion}
                handleDeleteQuestion={this.handleDeleteQuestion}
                handleStareQuestion={this.handleStareQuestion}
              />
            ))}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    isFetching,
    codeChecked,
    eventCodeValided,
    eventRoom,
    author,
    question,
    charactersLeft,
    questions,
    questionsSortBy,
  } = state.eventRoom;

  return {
    isFetching,
    codeChecked,
    eventCodeValided,
    eventRoom,
    question,
    charactersLeft,
    questions,
    questionsSortBy,
    author,
  };
};

const mapDispatchToProps = {
  openSnackbar,
  getEventRoom,
  typeQuestion,
  submitQuestion,
  leaveEventRoom,
  voteQuestion,
  editQuestion,
  deleteQuestion,
  stareQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestionPage);
