const moment = require('moment');
const _ = require('lodash');

module.exports = {


  friendlyName: 'Get event room',


  description: '',

  inputs: {
    code: {
      type: 'string',
      required: true,
      description: 'event code'
    }

  },


  exits: {

    notFoundEvent: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { code } = inputs;
    const currentDate =  moment().startOf('day').toDate();
    const sessionId = this.req.session.id;

    const eventRoom = await Event.findOne({
      code: code,
      startDate: { '<=': currentDate },
      endDate: { '>=': currentDate }
    })
    .populate('questions');

    if (!eventRoom) {
      return exits.notFoundEvent({
        status: 'error',
        message: 'Sorry, there is no such event active right now.'
      });
    }

    let questions = await Question.find({ belongToEvent: eventRoom.id }).populate('scores');

    eventRoom.questions = questions;
    const socketEventRoom = `EVENT_ROOM_${eventRoom.code}`;

    if (this.req.isSocket) {
      sails.sockets.join(this.req, socketEventRoom, (err) => {
        if (err) {
          sails.log.error('Could not join socket room', err);
        }
      });
    }
    const dataReturned = {
      sessionId,
      eventRoom,
    }

    return exits.success(dataReturned);
  }
};
