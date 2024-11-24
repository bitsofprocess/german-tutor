import dotenv from 'dotenv'
import { resolve } from 'path';
// Load environment variables from the .env file located in the project root
dotenv.config({ path: resolve('./.env') });

// Optionally, log to verify the env is loaded (not recommended in production)
// console.log(process.env);

export const env = process.env;  // Export the environment variables
