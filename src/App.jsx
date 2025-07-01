import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import UploadFile from './components/UploadFile';
import DownloadFile from './components/DownloadFile';
import StoredFiles from './components/StoredFiles';
import NodeVisualization from './components/NodeVisualization';
import Navigation from './components/Navigation';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [files, setFiles] = useState([]);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('storify-files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles).map((file) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }));
        setFiles(parsedFiles);
      } catch (error) {
        console.error('Error loading saved files:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('storify-files', JSON.stringify(files));
  }, [files]);

  const handleFileUploaded = (file) => {
    setFiles(prevFiles => [file, ...prevFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const handleDownloadFile = (file) => {
    setCurrentView('download');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Homepage onNavigate={setCurrentView} />;
      case 'upload':
        return <UploadFile onFileUploaded={handleFileUploaded} />;
      case 'download':
        return <DownloadFile files={files} />;
      case 'files':
        return (
          <StoredFiles 
            files={files} 
            onDeleteFile={handleDeleteFile}
            onDownloadFile={handleDownloadFile}
          />
        );
      case 'nodes':
        return <NodeVisualization files={files} />;
      default:
        return <Homepage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'home' && (
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
      )}
      {renderCurrentView()}
    </div>
  );
}

export default App;