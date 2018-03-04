module.exports = {


  friendlyName: 'Leave event room',


  description: '',


  inputs: {
    eventCode: {
      type: 'string',
      required: true,
    }

  },


  exits: {
    badRequest: {
      statusCode: 401,
    },

    serverError: {
      statusCode: 500,
    }

  },


  fn: async function (inputs, exits) {

    if (!this.req.isSocket) {
      return exits.badRequest('This endpoints only supports socket requests.');
    }

    const socketEventRoom = `EVENT_ROOM_${inputs.eventCode}`;
    sails.sockets.leave(this.req, socketEventRoom, (err) =>  {
      if (err) {return exits.serverError(err);}

      return exits.success({
        status: 'success',
        message: `Successfully leaved room ${eventCode}`,
      });
    });
  }


};
