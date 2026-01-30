import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ToolViewer } from './pages/ToolViewer';
import { Login } from './pages/Login';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/dashboard" element={<Dashboard user={CURRENT_USER} />} />
        <Route path="/tool/:id" element={<ToolViewer />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;