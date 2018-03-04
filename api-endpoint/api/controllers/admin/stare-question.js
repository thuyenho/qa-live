module.exports = {


  friendlyName: 'stare a question',


  description: 'stare a question',


  inputs: {
    eventCode: {
      type: 'string',
      required: true
    },

    questionId: {
      type: 'ref',
      required: true,
    },

    stared: {
      type: 'boolean',
      defaultsTo: false,
    }

  },

  exits: {
    badRequest: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { stared, eventCode, questionId } = inputs;
    const session = this.req.session;
    const userId = session.user.id;

    const eventRoom = await Event.findOne({
      code: eventCode,
      createdBy: userId,
    });

    if (!eventRoom) {
      return exits.badRequest({
        status: 'error',
        message: 'Invalid event.',
      });
    }

    const questions = await Question
        .find({ belongToEvent: eventRoom.id});

    if (!questions.length) {
      return exits.badRequest({
        status: 'error',
        message: 'You voted for question which is not existed.',
      });
    }

    if (stared) {
      const numberQuestionsHighlighted = _.filter(questions, q => q.highlighted );
      if (numberQuestionsHighlighted.length >= 3) {
        return exits.badRequest({
          status: 'error',
          message: 'A maximum of questions highlighted is 3.',
        });
      }
    }

    await Question.update(
      { id: questionId },
      { highlighted: stared },
    );

    let questionUpdated = await Question
        .findOne({ id: questionId, belongToEvent: eventRoom.id})
        .populate('scores');

    // Broadcast QUESTION_UPDATED to clients.
    const socketEventRoom = `EVENT_ROOM_${eventCode}`;
    const socketEventType = 'SOCKET_EVENT_QUESTION_UPDATED'; // Please sure socket client listenning the same event.
    sails.sockets.broadcast(socketEventRoom, socketEventType, questionUpdated, this.req);

    return exits.success(questionUpdated);
  }

};
