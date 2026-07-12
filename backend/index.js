import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runResearchAgent } from './agent.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Investment Research Agent Backend is healthy' });
});

// Research route
app.post('/api/research', async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'companyName is required' });
    }

    const result = await runResearchAgent(companyName);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error during research:', error);
    res.status(500).json({ error: error.message || 'An error occurred during research' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
