import { getDB } from '../config/database.js';

export class MetadataService {
  constructor() {
    // In-memory storage for demo when MongoDB is not available
    this.memoryStorage = new Map();
  }

  async saveFileMetadata(fileData) {
    try {
      const db = getDB();
      if (db) {
        const collection = db.collection('files');
        await collection.insertOne(fileData);
      } else {
        // Fallback to memory storage
        this.memoryStorage.set(fileData.filename, fileData);
      }
      console.log(`💾 Metadata saved for: ${fileData.filename}`);
    } catch (error) {
      // Fallback to memory storage on error
      this.memoryStorage.set(fileData.filename, fileData);
      console.log(`💾 Metadata saved to memory for: ${fileData.filename}`);
    }
  }

  async getFileMetadata(filename) {
    try {
      const db = getDB();
      if (db) {
        const collection = db.collection('files');
        const result = await collection.findOne({ filename });
        return result;
      } else {
        // Fallback to memory storage
        return this.memoryStorage.get(filename) || null;
      }
    } catch (error) {
      // Fallback to memory storage on error
      return this.memoryStorage.get(filename) || null;
    }
  }

  async listFiles() {
    try {
      const db = getDB();
      if (db) {
        const collection = db.collection('files');
        const files = await collection.find({}).toArray();
        return files.map(file => ({
          filename: file.filename,
          size: file.originalSize,
          chunks: file.totalChunks,
          uploadTime: file.uploadTime,
          mimeType: file.mimeType
        }));
      } else {
        // Fallback to memory storage
        return Array.from(this.memoryStorage.values()).map(file => ({
          filename: file.filename,
          size: file.originalSize,
          chunks: file.totalChunks,
          uploadTime: file.uploadTime,
          mimeType: file.mimeType
        }));
      }
    } catch (error) {
      // Fallback to memory storage on error
      return Array.from(this.memoryStorage.values()).map(file => ({
        filename: file.filename,
        size: file.originalSize,
        chunks: file.totalChunks,
        uploadTime: file.uploadTime,
        mimeType: file.mimeType
      }));
    }
  }
}