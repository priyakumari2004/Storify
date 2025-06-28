import express from 'express';
import multer from 'multer';
import { uploadFile, downloadFile, listFiles } from '../controllers/fileController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:filename', downloadFile);
router.get('/files', listFiles);

export default router;