import dotenv from 'dotenv';
import logger from './src/utils/logger/color-logger.js';
import { initializeApp } from './src/loaders/index-loader.js';

// Load environment variables
dotenv.config();

// Start server
const startServer = async () =>{
    try{
//  Initialize appplication with express
const {server} =  await initializeApp();

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    await shutdownApp(server);
    process.exit(0);
  };
  
  // Handle termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION', err);
    gracefulShutdown('UNHANDLED REJECTION');
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION', err);
    gracefulShutdown('UNCAUGHT EXCEPTION');
  });

    } catch(error){
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

// Start everything
startServer();