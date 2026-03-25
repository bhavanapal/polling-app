import logger from "../utils/logger/color-logger.js";
import { initializeExpress } from "./express-loader.js";
import { connectToDB } from "./mongoose-loader.js";
import { socketLoader } from "./socket-loader.js";
import http from "http";

/***
 * initialize core application loaders in the correct order
 * focused on express for initial setup
 */

export const initializeApp = async () =>{
    try{
      logger.info('Initializing application...');

      // Initialize MongoDb first
      logger.info('Initializing database connection...')
      const dbConnection = await connectToDB();
      logger.success('Database connection established');

    //   Initialize Express application
    logger.info('Initializing Express application...');
    const app = initializeExpress();
    logger.success('Express application initialized');

    // create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    socketLoader(server);
    logger.success('Socket.IO initialized');

  //  start server
  server.listen(process.env.PORT || 5000, () => {
    logger.success(`Server running on port ${process.env.PORT || 5000}`);
  });

  logger.success('Application startup completed successfully');
  return{ app, server, dbConnection};

    } catch(error){
       logger.error('Application initialization failed', error);
       throw error;
    }
};

/***
 * Shuts down the application gracefully
 */

export const shutdownApp = async(server) =>{
  logger.info('Initiating graceful shutdown...');
  
  if(server){
    server.close(() => {
        logger.info('HTTP server closed');
    });
  }

  try{
  // close mongodb connection
  const mongoose = await import('mongoose');
  if(mongoose.connection.readyState){
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
  }catch(err){
    logger.info('Error during MongoDb disconnection', err);
  }

  logger.info('Shutdown complete');
};
