import express from 'express';
import cors from 'cors';
import openAIRoutes from './routes/openAIRoutes.js';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// API routes
app.use('/openai', openAIRoutes);

// Start server
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
