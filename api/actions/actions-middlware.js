// add middlewares here related to actions
const Actions = require('./actions-model');


function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    })
  }


  module.exports = {
      handleError,
  }