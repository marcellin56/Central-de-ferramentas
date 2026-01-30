import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ToolViewer } from './pages/ToolViewer';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="/dashboard" 
          element={<Dashboard user={CURRENT_USER} />} 
        />

        <Route 
          path="/tool/:id" 
          element={<ToolViewer />} 
        />

        {/* Default redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;