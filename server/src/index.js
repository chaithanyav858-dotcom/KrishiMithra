import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { seedDatabase } from './db/seed.js';

import metaRoutes from './routes/metaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json());

// Request logger for development transparency
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'KrishiMitra Agricultural Decision Support System',
    institution: 'Department of Computer Science & Engineering, Malnad College of Engineering, Hassan',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE !== 'false',
    weatherProvider: process.env.WEATHER_PROVIDER || 'open-meteo',
    modelAdapter: process.env.MODEL_SERVICE_URL ? 'external-python-fastapi' : 'demo-agronomic-heuristics-v1'
  });
});

// Mount modular API routes
app.use('/api/meta', metaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/history', historyRoutes);

// 404 handler for unknown routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.originalUrl} not found.`
  });
});

const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server exception:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

// Ensure database is seeded with demo account and plots
seedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌾 KrishiMitra Backend API Service Started`);
    console.log(`📍 Listening on http://localhost:${PORT}`);
    console.log(`🎓 MCE CSE 5th Semester Mini Project`);
    console.log(`🌱 Demo Login: demo@krishimitra.agr / Demo@123`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize seed on startup:', err);
});
