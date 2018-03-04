/**
 * Event.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
    },

    code: {
      type: 'string',
      unique: true,
      required: true,
      regex: /^[a-z0-a9\-\_]+$/i, // A value that is a string consisting of only letters, numbers, and/or dashes.
    },

    startDate: {
      type: 'ref', // implicty date type
      required: true,
    },

    endDate: {
      type: 'ref',
      required: true,
    },

    createdBy: {
      model: 'adminuser',
    },

    questions: {
      collection: 'question',
      via: 'belongToEvent',
    }

  },

};

