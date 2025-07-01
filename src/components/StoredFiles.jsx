import React, { useState } from 'react';
import { File, Server, Calendar, HardDrive, Shield, Trash2, Eye, Download } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils';

const StoredFiles = ({ files, onDeleteFile, onDownloadFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAndSortedFiles = files
    .filter(file => filterStatus === 'all' || file.metadata.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        default:
          return 0;
      }
    });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const completeFiles = files.filter(file => file.metadata.status === 'complete').length;

  if (files.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stored Files</h1>
          <div className="bg-gray-50 rounded-2xl p-12">
            <HardDrive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Files Stored</h3>
            <p className="text-gray-500">Upload some files to see them here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Stored Files</h1>
        <p className="text-xl text-gray-600">Manage and monitor your distributed file storage</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <File className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{files.length}</span>
          </div>
          <p className="text-gray-600">Total Files</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <HardDrive className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</span>
          </div>
          <p className="text-gray-600">Total Size</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">{completeFiles}</span>
          </div>
          <p className="text-gray-600">Complete</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Server className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">3</span>
          </div>
          <p className="text-gray-600">Nodes</p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="date">Upload Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Files</option>
              <option value="complete">Complete</option>
              <option value="partial">Partial</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredAndSortedFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                  selectedFile?.id === file.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <File className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.metadata.totalChunks} chunks</span>
                        <span>{formatDate(file.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      file.metadata.status === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : file.metadata.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {file.metadata.status}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadFile(file);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sticky top-6">
            {selectedFile ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">File Details</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 break-words">{selectedFile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Size</label>
                    <p className="text-gray-900">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-gray-900">{selectedFile.type || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Upload Date</label>
                    <p className="text-gray-900">{formatDate(selectedFile.uploadDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedFile.metadata.status === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedFile.metadata.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedFile.metadata.status}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Chunk Distribution</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map(nodeId => {
                      const nodeChunks = selectedFile.chunks.filter(chunk => chunk.nodeId === nodeId);
                      return (
                        <div key={nodeId} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Server className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">Node {nodeId}</span>
                            </div>
                            <span className="text-sm text-gray-600">{nodeChunks.length} chunks</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(nodeChunks.length / selectedFile.metadata.totalChunks) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Select a file to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoredFiles;