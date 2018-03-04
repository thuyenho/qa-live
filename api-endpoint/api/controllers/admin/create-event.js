const moment = require('moment');

const DATE_FORMATE = 'YYYY-MM-DD';

module.exports = {


  friendlyName: 'Create event',


  description: '',


  inputs: {
    name: {
      type: 'string',
      required: true,
    },

    code: {
      type: 'string',
      required: true,
    },

    startDate: {
      type: 'ref',
      required: true,
    },

    endDate: {
      type: 'ref',
      required: true,
    }

  },


  exits: {
    invalidCode: {
      statusCode: 401
    },

    eventExisted: {
      statusCode: 401
    },

    invalidDate: {
      statusCode: 401,
    }

  },


  fn: async function (inputs, exits) {
    const { name, code } = inputs;
    const userId = this.req.session.user.id;
    let startDate = moment(inputs.startDate, DATE_FORMATE);
    let endDate = moment(inputs.endDate, DATE_FORMATE);


    if (!/^[a-z0-9\_\-]+$/i.test(code)) {
      return exits.invalidCode({
        status: 'error',
        message: 'Code is a string consisting of only letters, numbers, and/or dashes.'
      });
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      return exits.invalidDate({
        status: 'error',
        message: 'Invalid start date or end date.'
      });
    }

    if (endDate.isBefore(startDate)) {
      return exits.invalidDate({
        status: 'error',
        message: 'Invalid the end date.'
      });
    }

    const eventExisted = await Event.findOne({ code });
    if (eventExisted) {
      return exits.eventExisted({
        status: 'error',
        message: 'Event code you entered already existed.'
      });
    }

    startDate = startDate.toDate();
    endDate = endDate.toDate();

    try {
      const eventRecord = await Event.create({ name, code, startDate, endDate, createdBy: userId }).fetch();
      return exits.success(eventRecord);

    } catch (err) {
      sails.log.error(err);
      return this.res.serverError();
    }
  }
};
