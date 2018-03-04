module.exports = {


  friendlyName: 'Login',


  description: 'Log in using the provided email and password combination.',


  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    email: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string', required: true
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged in.',
    },

    badCombo: {
      statusCode: 401,
      description: `The provided email and password combination does not
      match any user in the database.`,
    },

    incorrectPassword: {
      statusCode: 401,
      description: 'Password entered is incorrect.'
    }

  },


  fn: async function (inputs, exits) {
    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await AdminUser.findOne({
      email: inputs.email.toLowerCase(),
    });

    // If there was no matching user, respond thru the "badCombo" exit.
    if(!userRecord) {
      exits.badCombo({ status: 'error', message: 'Email or password you entered is incorrect.'});
    }

    // If the password doesn't match, then also exit thru "badCombo".
    await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
    .intercept('incorrect', () => exits.incorrectPassword({ status: 'error', message: 'Password you entered is incorrect.'}));
    this.req.session.user = userRecord;
    return exits.success(userRecord);
  }

};
