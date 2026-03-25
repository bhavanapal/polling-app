import {logger} from "../../../utils/logger/app-logger.js";
import mongoose from 'mongoose';

// catch asyn errors
export const asyncHandler = (fn) => (req,res, next) => {
    Promise.resolve(fn(req,res,next)).catch(next);
};

// error handling middleware
export const errorHandler = (err, req, res,next) =>{
    let statusCode = err.statusCode || 500;

    // Log error details
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, err);
    // Handle Mongoose validation errors
    if(err instanceof mongoose.Error.ValidationError){
        statusCode = 400;
        const errors = object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));

        logger.error(`Mongoose validation error: ${JSON.stringify(errors)}`);

        return res.status(statusCode).json({
            success:false,
            message:'Validation failed',
            errors
        });
    }

    // handle mongoose castError(invalid objectId)
    if(err instanceof mongoose.Error.CastError){
        statusCode = 400;
        message = `Invalid ${err.path} : ${err.value}`;
        logger.error(`Cast error: ${message}`);

        return res.status(statusCode).json({
            success:false,
            message
        });
    }

    // perpare error response
    const response = {
        success:false,
        error:{
            message: err.message || 'Internal Server Error', ...(process.env.NODE_ENV === 'development' && { stack: err.stack})
        }
    };
    res.status(statusCode).json(response);
};

// Custome API error class
export class ApiError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// not found error middleware
export const notFound = (req, res,next) => {
    next(new ApiError(`Route not found: ${req.originalUrl}`,404));
};