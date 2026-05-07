import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './modules/home';
import ArticleDetail from './modules/article';
import Login from './modules/auth/login';
import Register from './modules/auth/register';
import ForgotPassword from './modules/auth/forgot-password';
import ResetPassword from './modules/auth/reset-password';
import Profile from './modules/profile';
import AdminDashboard from './modules/admin/dashboard';
import AdminNewsList from './modules/admin/news';
import AdminNewsAdd from './modules/admin/news/add';

import AdminUsers from './modules/admin/users';
import AdminReports from './modules/admin/reports';
import AdminComments from './modules/admin/comments';
import AdminProfilePage from './modules/admin/profile';
import Terms from './modules/legal/Terms';
import Privacy from './modules/legal/Privacy';

import AdminRoute from './routes/AdminRoute';
import { ToastProvider } from './context/ToastContext';

interface AppProps {}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />

        <Route path="/article/:id" element={
          <PublicLayout>
            <ArticleDetail />
          </PublicLayout>
        } />
        
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />

        <Route path="/profile" element={
          <PublicLayout>
            <Profile />
          </PublicLayout>
        } />

        <Route element={<AdminRoute />}>
          <Route path="/*" element={
            <AdminLayout>
              <Routes>
                <Route path="/admin/profile" element={<Profile />} />
                <Route path="/admin/favorites" element={<Profile />} />
                <Route path="/admin/interests" element={<Profile />} />
                <Route path="/admin/history" element={<Profile />} />
                <Route path="/admin/upgrade" element={<Profile />} />
                
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/news" element={<AdminNewsList />} />
                <Route path="/admin/news/add" element={<AdminNewsAdd />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          } />
        </Route>
      </Routes>
    </Router>
  </ToastProvider>
);
}

export default App;