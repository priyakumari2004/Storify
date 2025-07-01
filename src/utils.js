export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateChecksum = (data) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

export const chunkFile = (file) => {
  return new Promise((resolve) => {
    const chunkSize = 64 * 1024; // 64KB chunks
    const chunks = [];
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    const reader = new FileReader();
    let currentChunk = 0;
    
    const readNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const blob = file.slice(start, end);
      reader.readAsArrayBuffer(blob);
    };
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      chunks.push(btoa(binaryString));
      
      currentChunk++;
      if (currentChunk < totalChunks) {
        setTimeout(readNextChunk, 10); // Simulate processing delay
      } else {
        resolve({
          chunks,
          metadata: {
            totalChunks,
            originalSize: file.size,
            chunkSize
          }
        });
      }
    };
    
    readNextChunk();
  });
};

export const distributeChunks = (chunks, fileId) => {
  const nodes = [1, 2, 3]; // Three nodes
  const fileChunks = [];
  
  chunks.forEach((chunk, index) => {
    // Primary replica
    const primaryNode = (index % 3) + 1;
    fileChunks.push({
      id: generateId(),
      nodeId: primaryNode,
      chunkIndex: index,
      size: chunk.length,
      checksum: generateChecksum(chunk)
    });
    
    // Secondary replica for redundancy
    const secondaryNode = ((index + 1) % 3) + 1;
    fileChunks.push({
      id: generateId(),
      nodeId: secondaryNode,
      chunkIndex: index,
      size: chunk.length,
      checksum: generateChecksum(chunk)
    });
  });
  
  return fileChunks;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};