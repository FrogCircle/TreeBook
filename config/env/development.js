'use strict';

module.exports = {
  //db: 'mongodb://' + (process.env.MONGODB || 'localhost') + '/mean-dev',
  db: 'mongodb://treebookuser:7777jjjj@ds045107.mongolab.com:45107/treebook',
  debug: true,
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  app: {
    name: 'TreeBook'
  },
  facebook: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'DEFAULT_CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'DEFAULT_API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: process.env.TBEMAIL, // sender address like ABC <abc@example.com>
  mailer: {
    service: 'gmail', // Gmail, SMTP
    auth: {
      user: process.env.TBEMAIL,
      pass: process.env.TBPASS
    }
  }
};
