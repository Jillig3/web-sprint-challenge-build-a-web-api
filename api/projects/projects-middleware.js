// add middlewares here related to projects
const Project = require('./projects-model.js');

function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    })
  }


  module.exports = {
      handleError,
  }