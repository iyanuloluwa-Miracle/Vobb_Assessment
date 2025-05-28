import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/carRoutes';
import managerRoutes from './routes/managerRoutes';
import { connectDB } from './database/connection';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Placeholder route
app.get('/', (req, res) => {
  res.send('Car Dealership API');
});

// MongoDB connection
connectDB();

app.use('/api/cars', carRoutes);
app.use('/api/managers', managerRoutes);

export default app; 