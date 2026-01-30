import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.tsx';
import { ToolViewer } from './pages/ToolViewer.tsx';
import { Login } from './pages/Login.tsx';
import { CURRENT_USER } from './constants.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to Login first for the full flow */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/login" 
          element={<Login onLogin={() => {}} />} 
        />

        <Route 
          path="/dashboard" 
          element={<Dashboard user={CURRENT_USER} />} 
        />

        <Route 
          path="/tool/:id" 
          element={<ToolViewer />} 
        />

        {/* Default catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;