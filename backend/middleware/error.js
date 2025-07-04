const AppError = require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err = new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    err = new AppError(
      `Duplicate field value: ${value}. Please use another value!`,
      400
    );
  }

  // Handle Mongoose CastError (invalid ID)
  if (err.name === "CastError") {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again!", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new AppError("Your token has expired! Please log in again.", 401);
  }

  // Development error response
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak error details
    else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

module.exports = { errorHandler };
