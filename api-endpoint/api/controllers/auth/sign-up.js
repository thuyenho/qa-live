module.exports = {


  friendlyName: 'Sign up',


  description: '',


  inputs: {
    email: {
      type: 'string',
      isEmail: true,
      required: true
    },

    password: {
      type: 'string',
      minLength: 6,
      required: true
    }

  },


  exits: {
    emailAlreadyInUse: {
      statusCode: 401
    }

  },

  fn: async function (inputs, exits) {
    const email = inputs.email.toLowerCase();

    const userExisted = await AdminUser.findOne({ email });

    if (userExisted) {
      return exits.emailAlreadyInUse({
        status: 'error',
        message: 'The provided email is already in use.'
      });
    }

    const newUser = await AdminUser.create({
      email,
      password: await sails.helpers.passwords.hashPassword(inputs.password)
    })
    .intercept({ name: 'UsageError' }, () => exits.invalid({ status: 'error', message: 'The provided email and/or password are invalid.' }))
    .fetch();

    return exits.success(newUser);
  }


};
