import {createConnection} from '../config/db.js';
import logger from '../utils/logger/color-logger.js';
import mongoose from 'mongoose';

export const setupEvents = () =>{
    // Add event listeners for connection status
    mongoose.connection.on('error' , (err) =>{
        logger.error('MongoDb connection failed' , err);
    });

    mongoose.connection.on('disconnected', (err) => {
        logger.info('MongoDB connection failed', err);
    });

    process.on('SIGINT', async() => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to app termination');
        process.exit(0);
    });
}

export const connectToDB = async() =>{
    try{
     const connection = await createConnection();
     setupEvents();
     logger.success(`MongoDb connected: ${connection.connection.host}`);
     return connection;
    } catch(error){
     logger.error('MongoDB connection failed:', error);
     throw error;
    }
};