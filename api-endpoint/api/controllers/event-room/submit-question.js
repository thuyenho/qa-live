const moment = require('moment');

module.exports = {


  friendlyName: 'Submit question',


  description: '',


  inputs: {
    author: {
      type: 'string',
      maxLength: 50,
    },

    content: {
      type: 'string',
      required: true,
    },

    eventCode: {
      type: 'string',
      required: true,
    }

  },


  exits: {

    invalidEvent: {
      statusCode: 401,
    },
  },


  fn: async function (inputs, exits) {
    const { author, content, eventCode } = inputs;
    const currentDate =  moment().startOf('day').toDate();
    const sessionId = this.req.session.id;

    const eventRoom = await Event.findOne({
      code: eventCode,
      startDate: { '<=': currentDate },
      endDate: { '>=': currentDate }
    });

    if (!eventRoom) {
      return exits.invalidEvent({
        status: 'error',
        message: 'Event is not active now or invalid event.',
      });
    }

    let questionCreated = await Question.create({
      content,
      author: {
        sessionId,
        name: author ? author: '',
      },
      belongToEvent: eventRoom.id,
    }).fetch();

    questionCreated.scores = [];

    const socketEventRoom = `EVENT_ROOM_${eventCode}`;
    const socketEventType = 'SOCKET_EVENT_NEW_QUESTION_ADDED'; // Please sure socket client listenning the same event.
    sails.sockets.broadcast(socketEventRoom, socketEventType, questionCreated, this.req);

    return exits.success(questionCreated);

  }


};
