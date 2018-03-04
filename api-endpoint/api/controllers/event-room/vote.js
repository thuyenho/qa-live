const moment = require('moment');

module.exports = {


  friendlyName: 'Vote',


  description: 'Vote event room.',


  inputs: {
    eventCode: {
      type: 'string',
      required: true
    },

    questionId: {
      type: 'ref',
      required: true,
    },

    score: {
      type: 'number',
      required: true,
      isIn: [-1, 1],
    }

  },


  exits: {
    badRequest: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { eventCode, score } = inputs;
    const currentDate =  moment().startOf('day').toDate();
    const sessionId = this.req.session.id;
    questionId = inputs.questionId;

    const eventRoom = await Event.findOne({
      code: eventCode,
      startDate: { '<=': currentDate },
      endDate: { '>=': currentDate }
    });

    if (!eventRoom) {
      return exits.badRequest({
        status: 'error',
        message: 'Event is not active now or invalid event.',
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

    await Vote.findOrCreate(
      { sessionId, question: questionId },
      { sessionId, question: questionId , score }
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
