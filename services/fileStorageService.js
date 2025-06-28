import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const STORAGE_NODES = ['node1', 'node2', 'node3'];

export class FileStorageService {
  constructor() {
    this.ensureStorageDirectories();
  }

  ensureStorageDirectories() {
    const storageDir = 'storage';
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir);
    }
    
    STORAGE_NODES.forEach(node => {
      const nodePath = path.join(storageDir, node);
      if (!fs.existsSync(nodePath)) {
        fs.mkdirSync(nodePath, { recursive: true });
        console.log(`📁 Created storage node: ${node}`);
      }
    });
  }

  async storeFile(file) {
    const fileBuffer = fs.readFileSync(file.path);
    const chunks = this.splitIntoChunks(fileBuffer);
    const chunkMetadata = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = crypto.randomUUID();
      const node = this.selectStorageNode(i);
      const chunkPath = path.join('storage', node, `${chunkId}.chunk`);
      
      // Write chunk to storage node
      fs.writeFileSync(chunkPath, chunk);
      
      chunkMetadata.push({
        index: i,
        chunkId,
        node,
        path: chunkPath,
        size: chunk.length,
        checksum: crypto.createHash('md5').update(chunk).digest('hex')
      });
      
      console.log(`💾 Stored chunk ${i + 1}/${chunks.length} in ${node}`);
    }

    // Clean up temp file
    fs.unlinkSync(file.path);

    return {
      filename: file.originalname,
      originalSize: file.size,
      mimeType: file.mimetype,
      chunks: chunkMetadata,
      uploadTime: new Date(),
      totalChunks: chunks.length
    };
  }

  async reconstructFile(fileMetadata) {
    const chunks = [];
    
    // Sort chunks by index to ensure correct order
    const sortedChunks = fileMetadata.chunks.sort((a, b) => a.index - b.index);
    
    for (const chunkMeta of sortedChunks) {
      if (!fs.existsSync(chunkMeta.path)) {
        throw new Error(`Chunk not found: ${chunkMeta.path}`);
      }
      
      const chunkData = fs.readFileSync(chunkMeta.path);
      
      // Verify chunk integrity
      const checksum = crypto.createHash('md5').update(chunkData).digest('hex');
      if (checksum !== chunkMeta.checksum) {
        throw new Error(`Chunk corruption detected: ${chunkMeta.chunkId}`);
      }
      
      chunks.push(chunkData);
      console.log(`🔄 Reconstructed chunk ${chunkMeta.index + 1}/${sortedChunks.length}`);
    }

    return Buffer.concat(chunks);
  }

  splitIntoChunks(buffer) {
    const chunks = [];
    let offset = 0;

    while (offset < buffer.length) {
      const chunkSize = Math.min(CHUNK_SIZE, buffer.length - offset);
      const chunk = buffer.subarray(offset, offset + chunkSize);
      chunks.push(chunk);
      offset += chunkSize;
    }

    return chunks;
  }

  selectStorageNode(chunkIndex) {
    // Simple round-robin distribution
    return STORAGE_NODES[chunkIndex % STORAGE_NODES.length];
  }
}