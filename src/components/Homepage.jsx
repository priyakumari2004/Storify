import React from 'react';
import { Upload, Download, Database, Server, Shield, Zap } from 'lucide-react';

const Homepage = ({ onNavigate }) => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Files',
      description: 'Securely upload files with automatic chunking and distribution across nodes',
      action: () => onNavigate('upload'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Download,
      title: 'Download Files',
      description: 'Retrieve files with automatic chunk reassembly and integrity verification',
      action: () => onNavigate('download'),
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      icon: Database,
      title: 'Stored Files',
      description: 'View and manage all stored files with detailed metadata and status',
      action: () => onNavigate('files'),
      color: 'bg-amber-500 hover:bg-amber-600'
    }
  ];

  const systemFeatures = [
    {
      icon: Server,
      title: 'Distributed Architecture',
      description: 'Files are automatically chunked and distributed across multiple nodes for reliability'
    },
    {
      icon: Shield,
      title: 'Data Redundancy',
      description: 'Multiple replicas ensure your data remains accessible even if nodes fail'
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Parallel processing and smart load balancing for optimal speed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4">
                <Database className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Storify
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Distributed File Storage System with intelligent chunking, redundancy, and high availability
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => onNavigate('nodes')}
                className="border border-slate-400 text-slate-300 hover:text-white hover:border-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                View Node Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={feature.action}
            >
              <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-300 text-lg leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        


      </div>
    </div>
  );
};

export default Homepage;