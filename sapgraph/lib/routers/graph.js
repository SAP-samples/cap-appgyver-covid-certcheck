'use strict';

const router = require('express').Router();
const handler = require('../handlers/graph');

router.get('/getEmployeeData', handler.handleEmployeeQuery);

module.exports = router;
