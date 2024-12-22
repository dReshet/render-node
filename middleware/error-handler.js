const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong'
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ')
  }

  if (err.name === 'CastError') {
    customError.msg =  `Cannot find object with id: ${err.value}`
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for:${Object.keys(err.keyValue)} please enter a valid value`
  }
  return res.status(customError.statusCode).json({ err: customError.msg })
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware