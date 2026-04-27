import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewsList from './pages/AdminNewsList';
import AdminNewsAdd from './pages/AdminNewsAdd';

import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import AdminComments from './pages/AdminComments';
import AdminProfilePage from './pages/AdminProfilePage';
import Favorites from './pages/Favorites';
import AdminRoute from './components/AdminRoute';

interface AppProps {}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/news" element={<AdminNewsList />} />
                <Route path="/admin/news/add" element={<AdminNewsAdd />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/favorites" element={<Favorites />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
                
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;