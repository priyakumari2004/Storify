import React, { useState } from 'react';
import { Download, File, CheckCircle, Server, ArrowDown } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils';

const DownloadFile = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [reassemblySteps, setReassemblySteps] = useState([]);

  const handleDownload = async (file) => {
    setSelectedFile(file);
    setDownloading(true);
    setDownloadProgress(0);
    setReassemblySteps([]);

    // Simulate chunk retrieval and reassembly
    const totalChunks = file.metadata.totalChunks;
    const steps = [];

    for (let i = 0; i < totalChunks; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const chunkNodes = file.chunks
        .filter(chunk => chunk.chunkIndex === i)
        .map(chunk => chunk.nodeId);
      
      steps.push({
        chunkIndex: i,
        status: 'retrieved',
        nodes: chunkNodes,
        timestamp: new Date()
      });
      
      setReassemblySteps([...steps]);
      setDownloadProgress(((i + 1) / totalChunks) * 100);
    }

    // Simulate final file assembly
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Trigger actual download (simulated)
    const blob = new Blob(['Simulated file content'], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
      setSelectedFile(null);
      setReassemblySteps([]);
    }, 2000);
  };

  if (files.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Download Files</h1>
          <div className="bg-gray-50 rounded-2xl p-12">
            <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Files Available</h3>
            <p className="text-gray-500">Upload some files first to see them here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Download Files</h1>
        <p className="text-xl text-gray-600">Select a file to download and see the chunk reassembly process</p>
      </div>

      {!downloading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <File className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                    <p className="text-sm text-gray-500">{file.type || 'Unknown type'}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  file.metadata.status === 'complete' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {file.metadata.status}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chunks</span>
                  <span className="font-medium">{file.metadata.totalChunks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploaded</span>
                  <span className="font-medium">{formatDate(file.uploadDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Replication</span>
                  <span className="font-medium">{file.metadata.replicationFactor}x</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(file)}
                disabled={file.metadata.status !== 'complete'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Download Progress */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
                <ArrowDown className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Downloading</h3>
              <p className="text-gray-600">{selectedFile?.name}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Retrieved Chunks</span>
                <span>{reassemblySteps.length} / {selectedFile?.metadata.totalChunks}</span>
              </div>
            </div>

            {downloadProgress === 100 && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Download Complete!</span>
              </div>
            )}
          </div>

          {/* Chunk Reassembly Process */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Chunk Reassembly</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reassemblySteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      Chunk {step.chunkIndex}
                    </span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Retrieved</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">From nodes:</span>
                    {step.nodes.map((nodeId, i) => (
                      <span key={i} className="flex items-center space-x-1">
                        <Server className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{nodeId}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadFile;