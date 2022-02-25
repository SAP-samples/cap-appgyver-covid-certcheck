"use strict";

const cds = require("@sap/cds");
const cors = require("cors");

global.__base = __dirname + "/"
console.log(global.__base)
console.log(`CDS Custom Boostrap from /srv/server.js`)
//const allowList = ['https://platform.appgyver.com', 'https://preview.appgyver.com'];

/*
const corsOptions = {
  origin: function (origin, callback) {
    if (allowList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
*/

//cds.on("bootstrap", app => app.use(cors(corsOptions)));
cds.on('bootstrap', app => {

  const cors = require('cors')
  app.use(cors())
  app.use((req, res, next) => {
    const allowList = ['https://platform.appgyver.com', 'https://preview.appgyver.com'];
    if (allowList.indexOf(req.header('Origin')) !== -1) {
      res.setHeader('Access-Control-Allow-Origin', allowList[allowList.indexOf(req.header('Origin'))]);
    }
    next();
  })

  //CDS REST Handler
  let restURL = "/rest/"

  cds.serve('VerificationService')
    .to("rest")
    .at(restURL + 'verification')
    .in(app)
    .catch((err) => {
      app.logger.error(err);
    })

})

module.exports = cds.server