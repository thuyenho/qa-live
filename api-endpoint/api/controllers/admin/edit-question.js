const moment = require('moment');

module.exports = {


  friendlyName: 'Edit a question',


  description: 'Edit a question',


  inputs: {
    eventCode: {
      type: 'string',
      required: true
    },

    questionId: {
      type: 'ref',
      required: true,
    },

    content: {
      type: 'string',
      required: true,
    }

  },

  exits: {
    badRequest: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { eventCode, content } = inputs;
    const session = this.req.session;
    const userId = session.user.id;
    questionId = inputs.questionId;

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

    const question = await Question
        .findOne({ id: questionId, belongToEvent: eventRoom.id});

    if (!question) {
      return exits.badRequest({
        status: 'error',
        message: 'You voted for question which is not existed.',
      });
    }

    await Question.update(
      { id: question.id },
      { content },
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
