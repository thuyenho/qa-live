module.exports = {


  friendlyName: 'Get events',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const events = await Event.find({ createdBy: this.req.session.user.id }).sort('createdAt DESC');
    return exits.success(events);
  }


};
