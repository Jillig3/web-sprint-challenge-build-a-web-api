// add middlewares here related to actions
const Actions = require('./actions-model');


function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    })
}

function logger(req, res, next) {
    const timestamp = new Date().toLocaleString()
    // DO YOUR MAGIC
    const method = req.method
    const url = req.originalUrl
    console.log( `[${timestamp}] ${method} to ${url}`);
    next()
  }


  module.exports = {
      handleError,
      logger,
  }