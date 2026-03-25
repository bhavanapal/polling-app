import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import createError from 'http-errors';

// creates & configures the express application

const createApp = () =>{
    // create express application
    const app = express();

    // built-in middleware
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    // third-party middleware
    const allowedOrigins=[
        process.env.FRONTEND_URL_LOCAL,
        process.env.FRONTEND_URL_PROD,
    ].filter(Boolean);

    app.use(
        cors({
            origin:function(origin, callback) {
                if(!origin) return callback(null, true);
                if(allowedOrigins.includes(origin)) callback(null, true);
                else callback(new Error('Not allowed by CORS'));
            },
            credentials:true,
        })
    );

    app.use(helmet());
    app.use(compression());

    // rate limiting
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 100, //15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, Please try again after 15 minutes'
    });
    app.use('/api/v1', apiLimiter);

    return app;
};

export default createApp;