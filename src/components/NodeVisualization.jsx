import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Cpu, Wifi, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { formatFileSize } from '../utils';

const NodeVisualization = ({ files }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    // Initialize nodes with data from files
    const initialNodes = [
      {
        id: 1,
        name: 'Storage Node Alpha',
        status: 'online',
        totalStorage: 1000 * 1024 * 1024, // 1GB
        usedStorage: 0,
        chunks: []
      },
      {
        id: 2,
        name: 'Storage Node Beta',
        status: 'online',
        totalStorage: 1000 * 1024 * 1024, // 1GB
        usedStorage: 0,
        chunks: []
      },
      {
        id: 3,
        name: 'Storage Node Gamma',
        status: 'online',
        totalStorage: 1000 * 1024 * 1024, // 1GB
        usedStorage: 0,
        chunks: []
      }
    ];

    // Distribute file chunks across nodes
    files.forEach(file => {
      file.chunks.forEach(chunk => {
        const node = initialNodes.find(n => n.id === chunk.nodeId);
        if (node) {
          node.chunks.push(chunk);
          node.usedStorage += chunk.size;
        }
      });
    });

    setNodes(initialNodes);
    if (!selectedNode && initialNodes.length > 0) {
      setSelectedNode(initialNodes[0]);
    }
  }, [files]);

  const getNodeStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getNodeStatusBg = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100';
      case 'offline': return 'bg-red-100';
      case 'degraded': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const getStorageUsagePercentage = (node) => {
    return (node.usedStorage / node.totalStorage) * 100;
  };

  const getUniqueFilesOnNode = (node) => {
    const fileIds = [...new Set(node.chunks.map(chunk => {
      const file = files.find(f => f.chunks.some(c => c.id === chunk.id));
      return file?.id;
    }))];
    return fileIds.filter(id => id !== undefined).length;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Node Status</h1>
        <p className="text-xl text-gray-600">Monitor the health and distribution of your storage cluster</p>
      </div>

      {/* Cluster Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cluster Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-500 text-white w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Server className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{nodes.length}</div>
            <div className="text-gray-600">Total Nodes</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-white w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {nodes.filter(n => n.status === 'online').length}
            </div>
            <div className="text-gray-600">Online</div>
          </div>
          <div className="text-center">
            <div className="bg-purple-500 text-white w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <HardDrive className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatFileSize(nodes.reduce((sum, node) => sum + node.totalStorage, 0))}
            </div>
            <div className="text-gray-600">Total Storage</div>
          </div>
          <div className="text-center">
            <div className="bg-amber-500 text-white w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Activity className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {nodes.reduce((sum, node) => sum + node.chunks.length, 0)}
            </div>
            <div className="text-gray-600">Total Chunks</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Node List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Storage Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                  selectedNode?.id === node.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${getNodeStatusBg(node.status)}`}>
                      <Server className={`h-6 w-6 ${getNodeStatusColor(node.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{node.name}</h3>
                      <p className="text-sm text-gray-500">Node {node.id}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    node.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : node.status === 'offline'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {node.status === 'online' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    <span>{node.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Storage Usage</span>
                      <span>{Math.round(getStorageUsagePercentage(node))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getStorageUsagePercentage(node) > 80 
                            ? 'bg-red-500' 
                            : getStorageUsagePercentage(node) > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${getStorageUsagePercentage(node)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(node.usedStorage)}</span>
                      <span>{formatFileSize(node.totalStorage)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{node.chunks.length}</div>
                      <div className="text-xs text-gray-600">Chunks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{getUniqueFilesOnNode(node)}</div>
                      <div className="text-xs text-gray-600">Files</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default NodeVisualization;