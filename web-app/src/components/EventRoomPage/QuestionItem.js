import React from 'react';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import ButtonBase from 'material-ui/ButtonBase';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import { ThumbUp, ThumbDown } from 'material-ui-icons';

const styles = {
  card: {
  },
  thumbDown: {
    marginLeft: 5,
  },
  thumbUp: {
    marginLeft: 5,
  },
  voted: {
    color: 'blue',
  },
  question: {
    wordBreak: 'break-all',
  }
};

class QuestionItem extends React.Component {
  componentDidUpdate() {
    // Scroll down to question just submitted.
    // let scrollToElement = document.getElementById(this.props.question.id);
    // scrollToElement.scrollIntoView(true);
  }
  render() {
    const { question, handleDownVote, handleUpVote } = this.props;
    const dateCreated = moment(question.createdAt).format('MMMM Do YYYY');
    const author = question.author.name || 'Anonymous';
    let thumbUpStyle = styles.thumbUp;
    let thumbDownStyle = styles.thumbDown;

    if (question.scoreVotedByMe === -1) {
      thumbDownStyle = { ...thumbDownStyle, ...styles.voted };
    }
    if (question.scoreVotedByMe === 1) {
      thumbUpStyle = { ...thumbUpStyle, ...styles.voted };
    }
    const notVoted = question.scoreVotedByMe === 0;

    return (
      <Card id={question.id} style={styles.card} >
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
                  <div>
                    <ButtonBase onClick={() => notVoted && handleDownVote(question.id)}>
                      {question.negativeScore} <ThumbDown style={thumbDownStyle} />
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => notVoted && handleUpVote(question.id)}
                      style={styles.thumbUp}
                    >
                      {question.positiveScore} <ThumbUp style={thumbUpStyle} />
                    </ButtonBase>
                  </div>
                }
                title={author}
                subheader={dateCreated}
              />
            </Grid>
            <Grid item>
              <Typography style={styles.question}>
                {question.content}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card >
    );
  }
}
export default QuestionItem;
