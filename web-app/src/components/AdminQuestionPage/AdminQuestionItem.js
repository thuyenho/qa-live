import React from 'react';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { CardContent, CardHeader } from 'material-ui/Card';
import ButtonBase from 'material-ui/ButtonBase';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import {
  ThumbUp,
  ThumbDown,
  MoreVert,
  Star,
} from 'material-ui-icons';
import TextField from 'material-ui/TextField';

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
  question: {
    wordBreak: 'break-all',
  },
  overLength: {
    textAlign: 'right',
    opacity: 1,
    color: 'red',
  },
};

const subHeader = (positiveScore, negativeScore, dateCreated) => (
  <div>
    <ButtonBase>
      {negativeScore} <ThumbDown style={styles.thumb} />
    </ButtonBase>
    <ButtonBase style={styles.thumbUp} >
      {positiveScore}<ThumbUp style={styles.thumb} />
    </ButtonBase>
    <span> {dateCreated} </span>
  </div>
);

class AdminQuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openQuestionEditor: false,
      openMenu: false,
      anchorEl: null,
      question: props.question,
    };
    this.renderQuestionEditor = this.renderQuestionEditor.bind(this);
    this.onClickVerIcon = this.onClickVerIcon.bind(this);
    this.renderActionCard = this.renderActionCard.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.onClickEditMenu = this.onClickEditMenu.bind(this);
    this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onChangeQuestion = this.onChangeQuestion.bind(this);
  }

  componentDidUpdate() {
    // Scroll down to question just submitted.
    // let scrollToElement = document.getElementById(this.props.question.id);
    // scrollToElement.scrollIntoView(true);
  }

  onClickEditMenu() {
    this.setState({
      openQuestionEditor: true,
    });
    this.handleCloseMenu();
  }

  onClickDeleteQuestion() {
    this.handleCloseMenu();
    this.props.handleDeleteQuestion(this.props.question.id);
  }

  onClickVerIcon(event) {
    this.setState({
      openMenu: true,
      anchorEl: event.currentTarget,
    });
  }

  onChangeQuestion({ target: { value } }) {
    this.setState({
      question: { ...this.state.question, content: value },
    });
  }

  onClickSave() {
    const { id, content } = this.state.question;
    this.setState({
      openQuestionEditor: false,
    });
    this.props.handleEditQuestion(id, content);
  }

  handleCloseMenu() {
    this.setState({
      openMenu: false,
    });
  }

  renderActionCard() {
    const { question, handleStareQuestion } = this.props;

    return (
      <div>
        <IconButton onClick={() => handleStareQuestion(question)}>
          <Star style={question.highlighted ? styles.stared : {}} />
        </IconButton>

        <IconButton onClick={this.onClickVerIcon}>
          <MoreVert />
        </IconButton>
        <Menu
          id="menu"
          open={this.state.openMenu}
          anchorEl={this.state.anchorEl}
          onClose={this.handleCloseMenu}
        >
          <MenuItem onClick={this.onClickEditMenu}>
            Edit
          </MenuItem>
          <MenuItem onClick={this.onClickDeleteQuestion}>
            Delete
          </MenuItem>

        </Menu>
      </div>
    );
  }

  renderQuestionEditor() {
    const { question } = this.state;
    const characterLeft = 160 - question.content.length;
    const isOverLength = characterLeft < 0;
    return (
      <div>
        <TextField
          fullWidth
          multiline
          style={{ width: '80%' }}
          value={question.content}
          onChange={this.onChangeQuestion}
        />
        <Button
          disabled={isOverLength}
          style={{ marginLeft: 20 }}
          variant="raised"
          color="primary"
          size="small"
          onClick={this.onClickSave}
        >
          SAVE
        </Button>
        <Typography
          style={isOverLength ? styles.overLength : styles.characterCounter}
        >
          {characterLeft}
        </Typography>
      </div>
    );
  }

  render() {
    const {
      question,
    } = this.props;
    const dateCreated = moment(question.createdAt).format('h:mm, MMMM Do YYYY');
    const author = question.author.name || 'Anonymous';

    return (
      <div>
        <Divider />
        <CardContent>
          <Grid>
            <Grid item>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" >
                    {author[0].toUpperCase()}
                  </Avatar>
                }
                action={
                  this.renderActionCard()
                }
                title={author}
                subheader={subHeader(question.positiveScore, question.negativeScore, dateCreated)}
              />
            </Grid>
            <Grid item>
              {!this.state.openQuestionEditor && <Typography style={styles.question} paragraph>{this.state.question.content}</Typography>}
              {this.state.openQuestionEditor && this.renderQuestionEditor()}
            </Grid>
          </Grid>
        </CardContent>
      </div>
    );
  }
}

export default AdminQuestionItem;
