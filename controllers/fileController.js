import { FileStorageService } from '../services/fileStorageService.js';
import { MetadataService } from '../services/metadataService.js';

const fileStorage = new FileStorageService();
const metadata = new MetadataService();

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📤 Starting upload for: ${req.file.originalname}`);
    
    // Process file chunking and storage
    const result = await fileStorage.storeFile(req.file);
    
    // Save metadata
    await metadata.saveFileMetadata(result);
    
    console.log(`✅ Upload completed: ${req.file.originalname}`);
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.originalname,
      chunks: result.chunks.length,
      totalSize: req.file.size,
      nodes: result.chunks.map(chunk => chunk.node)
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log(`📥 Starting download for: ${filename}`);
    
    // Get file metadata
    const fileMetadata = await metadata.getFileMetadata(filename);
    if (!fileMetadata) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Reconstruct file from chunks
    const fileBuffer = await fileStorage.reconstructFile(fileMetadata);
    
    console.log(`✅ Download completed: ${filename}`);
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);
    
    res.send(fileBuffer);
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: 'Download failed: ' + error.message });
  }
};

export const listFiles = async (req, res) => {
  try {
    const files = await metadata.listFiles();
    res.json(files);
  } catch (error) {
    console.error('❌ List files error:', error);
    res.status(500).json({ error: 'Failed to list files: ' + error.message });
  }
};