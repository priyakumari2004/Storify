import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import fileRoutes from './routes/fileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', fileRoutes);

// Serve HTML frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Distributed File Storage Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB connection will be established...`);
  console.log(`📁 Storage nodes: node1, node2, node3`);
});