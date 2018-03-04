module.exports = {


  friendlyName: 'Me',


  description: 'Me admin.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const user = this.req.session.user;

    return exits.success(user);

  }


};
