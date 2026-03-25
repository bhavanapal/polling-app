import chalk from 'chalk';

/**
 * Simple but professional logger with color coding
 */
const logger = {
  info: (message) => {
    console.log(`${chalk.blue('INFO')} › ${message}`);
  },
  
  success: (message) => {
    console.log(`${chalk.green('SUCCESS')} › ${message}`);
  },
  
  warn: (message) => {
    console.log(`${chalk.yellow('WARNING')} › ${message}`);
  },
  
  error: (message, error) => {
    console.error(`${chalk.red('ERROR')} › ${message}`);
    if (error?.stack) console.error(chalk.red(error.stack));
  },
  
  db: (message) => {
    console.log(`${chalk.magenta('DATABASE')} › ${message}`);
  },
  
  http: (method, path, status) => {
    const statusColor = status >= 500 ? chalk.red : 
                        status >= 400 ? chalk.yellow : 
                        status >= 300 ? chalk.cyan : 
                        status >= 200 ? chalk.green : chalk.gray;
                        
    console.log(`${chalk.cyan('HTTP')} › ${method} ${path} ${statusColor(status)}`);
  }
};

export default logger;