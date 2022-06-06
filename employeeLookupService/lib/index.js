'use strict';
const GRAPH_INSTANCE_NAME = 'covidApp-graph';
const xsenv = require('@sap/xsenv');
const isLocalEnv = require('./utils/localEnv');
if (isLocalEnv()) {
  xsenv.loadEnv();
}

const express = require('express');
const passportLib = require('passport').Passport;
const { JWTStrategy } = require('@sap/xssec');
const helmet = require('helmet');
const graphRouter = require('./routers/graph');
const app = express();
const passport = new passportLib();

//set content security policy header
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\'', '*.hana.ondemand.com']
    }
  }
}));

passport.use(new JWTStrategy(xsenv.cfServiceCredentials("covidApp-uaa")));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));


app.use('/graph', graphRouter);

app.listen(process.env.PORT || 8080);
