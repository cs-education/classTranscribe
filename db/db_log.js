'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const utils = require('../utils/logging');
const uuid = require('uuid/v4');
const sequelize = models.sequelize;

const Logging = models.Logging;

function log_fatal( info ) {
  Logging.create({
    info: JSON.stringify(info),
    logType: 'fatal'
  })
}

function log_error( info ) {
  Logging.create({
    info: JSON.stringify(info),
    logType: 'error'
  })
}

function log_info( info ) {
  Logging.create({
    info: JSON.stringify(info),
    logType: 'info'
  })
}

function log_warning( info ) {
  Logging.create({
    info: JSON.stringify(info),
    logType: 'warning'
  })
}

module.exports = {
  log_fatal : log_fatal,
  log_info : log_info,
  log_error : log_error,
  log_warning : log_warning
}
