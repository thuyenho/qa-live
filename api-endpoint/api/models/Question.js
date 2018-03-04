/**
 * Question.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    content: {
      type: 'string',
      required: true,
      maxLength: 160,
    },

    highlighted: {
      type: 'boolean',
      defaultsTo: false,
    },

    // track who ask a question
    author: {
      type: 'ref', // e.g. { name: 'An', sessionId: 'ses001' }
      required: true,
    },

    scores: {
      collection: 'vote',
      via: 'question',
    },

    belongToEvent: {
      model: 'event',
    }

  },

};

