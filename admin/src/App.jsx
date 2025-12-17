import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import 'antd/dist/reset.css';

// 路由保护组件
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// 登录成功后重定向组件
const LoginSuccessRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // 登录成功处理
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login/success" element={<LoginSuccessRedirect />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
