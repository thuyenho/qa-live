module.exports = {


  friendlyName: 'Delete a question',


  description: 'Delete a question',


  inputs: {
    eventCode: {
      type: 'string',
      required: true
    },

    questionId: {
      type: 'ref',
      required: true,
    },

  },

  exits: {
    badRequest: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { eventCode, questionId } = inputs;
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

    const question = await Question
        .findOne({ id: questionId, belongToEvent: eventRoom.id});

    if (!question) {
      return exits.badRequest({
        status: 'error',
        message: 'You voted for question which is not existed.',
      });
    }

    let questionDeleted = await Question
        .destroy({ id: questionId })
        .fetch();

    // Broadcast QUESTION_UPDATED to clients.
    const socketEventRoom = `EVENT_ROOM_${eventCode}`;
    const socketEventType = 'SOCKET_EVENT_QUESTION_DELETED'; // Please sure socket client listenning the same event.
    sails.sockets.broadcast(socketEventRoom, socketEventType, questionDeleted[0], this.req);

    return exits.success(questionDeleted[0]);
  }

};
