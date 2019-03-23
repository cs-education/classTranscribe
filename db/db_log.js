'use strict';
var Sequelize = require('sequelize');
var models = require('../models');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const sequelize = models.sequelize;
const Op = Sequelize.Op;

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

async function dumpLog() {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const file = csvWriter({
      header: [
        {id: id, title: 'ID'},
        {id: info, title:'DETAIL'},
        {id: logType, title:'TYPE'}
      ],
      path: '/data/log/' + currentDate.replace(' ', '_')
  });

  // retrive data
  Logging.findAll({
    where : { createdAt : {[Op.lte] : currentDate }}}
  ).then(values => {

    // write to file
    file.writeRecords(values)
    .then(() => {
      // remove data
      Logging.destroy({
        where : { createdAt : {[Op.lte] : currentDate }}
      }).catch(err => {
        throw new Error('dumpLog() Failed' + err.message);
      })
    }).catch(err => {
      throw new Error('dumpLog() Failed' + err.message);
    })
  }).catch(err => {
    throw new Error('dumpLog() Failed' + err.message);
  })
}

module.exports = {
  log_fatal : log_fatal,
  log_info : log_info,
  log_error : log_error,
  log_warning : log_warning,
  dumpLog : dumpLog
}
