module.exports = function(question, sessionId) {
  const scores = question.scores;
  const negativeScore = _.sumBy(scores.filter(s => s.score === -1), o => o.score);
  const positiveScore = _.sumBy(scores.filter(s => s.score === 1), o => o.score);
  const votedByMe = _.find(scores, o => o.sessionId === sessionId );

  // 0 devotes that question has not been voted by user;
  const scoreVotedByMe = votedByMe ? votedByMe.score : 0;
  // Delete unneccessary field;
  delete question.scores;

  question.negativeScore = Math.abs(negativeScore);
  question.positiveScore = positiveScore;
  question.scoreVotedByMe = scoreVotedByMe;
  return question;
};
