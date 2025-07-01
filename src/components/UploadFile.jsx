import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Server } from 'lucide-react';
import { chunkFile, distributeChunks, generateId, formatFileSize } from '../utils';

const UploadFile = ({ onFileUploaded }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [chunkDistribution, setChunkDistribution] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    setUploading(true);
    const fileId = generateId();
    
    setUploadProgress({
      fileId,
      progress: 0,
      currentChunk: 0,
      totalChunks: 0,
      status: 'uploading'
    });

    try {
      // Simulate chunking process
      const { chunks, metadata } = await chunkFile(file);
      
      setUploadProgress(prev => prev ? {
        ...prev,
        totalChunks: metadata.totalChunks
      } : null);

      // Distribute chunks across nodes
      const fileChunks = distributeChunks(chunks, fileId);
      
      // Simulate upload progress
      for (let i = 0; i <= metadata.totalChunks; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(prev => prev ? {
          ...prev,
          currentChunk: i,
          progress: (i / metadata.totalChunks) * 100
        } : null);

        // Update chunk distribution visualization
        const distribution = fileChunks
          .filter(chunk => chunk.chunkIndex < i)
          .reduce((acc, chunk) => {
            const existing = acc.find(item => item.nodeId === chunk.nodeId);
            if (existing) {
              existing.chunks.push(chunk);
            } else {
              acc.push({
                nodeId: chunk.nodeId,
                chunks: [chunk]
              });
            }
            return acc;
          }, []);
        
        setChunkDistribution(distribution);
      }

      // Create stored file object
      const storedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        chunks: fileChunks,
        metadata: {
          totalChunks: metadata.totalChunks,
          replicationFactor: 2,
          status: 'complete'
        }
      };

      setUploadProgress(prev => prev ? {
        ...prev,
        status: 'complete'
      } : null);

      onFileUploaded(storedFile);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(null);
        setChunkDistribution([]);
      }, 2000);

    } catch (error) {
      setUploadProgress(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Files</h1>
        <p className="text-xl text-gray-600">Files are automatically chunked and distributed across nodes for reliability</p>
      </div>

      {!uploading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 mb-6">
                Supports all file types up to 100MB
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-colors duration-200"
              >
                Select File
              </label>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">File Chunking</h4>
                  <p className="text-gray-600">Files are split into 64KB chunks for efficient distribution</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Node Distribution</h4>
                  <p className="text-gray-600">Chunks are distributed across 3 nodes with 2x replication</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Integrity Check</h4>
                  <p className="text-gray-600">Checksums ensure data integrity and detect corruption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Progress */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                uploadProgress?.status === 'complete' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {uploadProgress?.status === 'complete' ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : uploadProgress?.status === 'error' ? (
                  <AlertCircle className="h-10 w-10 text-red-600" />
                ) : (
                  <File className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {uploadProgress?.status === 'complete' ? 'Upload Complete!' : 'Uploading...'}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(uploadProgress?.progress || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress?.progress || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Chunks</span>
                <span>{uploadProgress?.currentChunk} / {uploadProgress?.totalChunks}</span>
              </div>
            </div>
          </div>

          {/* Node Distribution Visualization */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Chunk Distribution</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(nodeId => {
                const nodeChunks = chunkDistribution.find(d => d.nodeId === nodeId)?.chunks || [];
                return (
                  <div key={nodeId} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Server className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Node {nodeId}</span>
                      </div>
                      <span className="text-sm text-gray-600">{nodeChunks.length} chunks</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-3 rounded ${
                            i < nodeChunks.length ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;