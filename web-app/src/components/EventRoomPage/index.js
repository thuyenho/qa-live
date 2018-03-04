import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import {
  getEventRoom,
  leaveEventRoom,
  typeQuestion,
  typeAuthor,
  submitQuestion,
  voteQuestion,
  questionSortChanged,
  openSnackbar,
} from '../../actions';
import QuestionItem from './QuestionItem';
import TextField from 'material-ui/TextField/TextField';

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
  characterCounter: {
    textAlign: 'right',
    opacity: 0.4,
  },
  overLength: {
    textAlign: 'right',
    opacity: 1,
    color: 'red',
  },
};

class EventRoomPage extends Component {
  constructor(props) {
    super(props);

    this.onChangeQuestion = this.onChangeQuestion.bind(this);
    this.onChangeQuestion = this.onChangeQuestion.bind(this);
    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
    this.onSubmitQuestion = this.onSubmitQuestion.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleVoteQuestion = this.handleVoteQuestion.bind(this);
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

  onChangeQuestion({ target: { value } }) {
    this.props.typeQuestion(value);
  }

  onChangeAuthor({ target: { value } }) {
    this.props.typeAuthor(value);
  }

  onSubmitQuestion() {
    const {
      author,
      question,
      eventRoom,
      submitQuestion,
      openSnackbar,
    } = this.props;
    const eventCode = eventRoom.code;
    const content = question;

    if (author.length > 50) {
      return openSnackbar('Your name was longer than 50 characters.');
    }
    return submitQuestion({ content, author, eventCode });
  }

  onChangeSort({ target: { value }}) {
    this.props.questionSortChanged(value);
  }

  handleVoteQuestion(questionId, score) {
    const eventCode = this.props.eventRoom.code;
    this.props.voteQuestion({ questionId, eventCode, score });
  }

  handleUpVote(questionId) {
    this.handleVoteQuestion(questionId, 1);
  }

  handleDownVote(questionId) {
    this.handleVoteQuestion(questionId, -1);
  }

  render() {
    const {
      codeChecked,
      question,
      author,
      eventCodeValided,
      questions,
      questionsSortBy,
      charactersLeft,
    } = this.props;
    const isOverLength = charactersLeft < 0;
    const emptyContent = question.length === 0;

    // TODO: Should return 404 page.
    if (codeChecked && !eventCodeValided) {
      return <Redirect to="/404" />;
    }

    if (!codeChecked) {
      return (<div>Loading...</div>);
    }
    
    return (
      <div>
        <Grid
          container
          direction="column"
          style={styles.container}
        >
          <Typography style={styles.header}> Ask the speaker </Typography>
          <Grid item xs={12}>
            <Card style={styles.card}>
              <CardContent>
                <Input
                  autoFocus
                  multiline
                  fullWidth
                  rows={2}
                  InputProps={{ disableUnderline: true }}
                  placeholder="Type your question"
                  value={question}
                  onChange={this.onChangeQuestion}
                />
                <Typography
                  style={isOverLength ? styles.overLength : styles.characterCounter}
                  component="p"
                >
                  {charactersLeft}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Chip
                      avatar={<Avatar>{author ? author[0].toUpperCase(): 'A'}</Avatar>}
                      // label={author || 'Anonymous'}
                    />
                    <TextField
                      placeholder="Your name (optional)"
                      value={author}
                      onChange={this.onChangeAuthor}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      disabled={isOverLength || emptyContent}
                      style={styles.button}
                      variant="raised"
                      color="primary"
                      onClick={this.onSubmitQuestion}
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid container justify="space-between">
            <Typography style={styles.header}>{questions.length} Questions </Typography>
            <Select
              value={questionsSortBy}
              style={{ width: 100, marginTop: 20, marginRight: 20 }}
              onChange={this.onChangeSort}
            >
              <MenuItem value={'positiveScore'}>Popular</MenuItem>
              <MenuItem value={'createdAt'}>Recent</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            {questions.map(question => (
              <QuestionItem
                key={question.id}
                question={question}
                handleDownVote={this.handleDownVote}
                handleUpVote={this.handleUpVote}
              />
            ))}
          </Grid>
        </Grid>
      </div>
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
  typeAuthor,
  submitQuestion,
  leaveEventRoom,
  voteQuestion,
  questionSortChanged,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventRoomPage);
