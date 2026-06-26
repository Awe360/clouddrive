import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useFiles } from './hooks/useFiles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const auth = useAuth();
  const files = useFiles(auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            <LoginPage
              login={auth.login}
              isAuthenticated={auth.isAuthenticated}
              error={auth.error}
              setError={auth.setError}
            />
          }
        />

        {/* Public Register Route */}
        <Route
          path="/register"
          element={
            <RegisterPage
              register={auth.register}
              isAuthenticated={auth.isAuthenticated}
              error={auth.error}
              setError={auth.setError}
            />
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            auth.loading ? (
              <div className="fullscreen-loader">
                <div className="spinner"></div>
                <p>Checking authentication...</p>
              </div>
            ) : auth.isAuthenticated ? (
              <DashboardPage
                user={auth.user}
                loading={auth.loading}
                logout={auth.logout}
                files={files.files}
                stats={files.stats}
                filesLoading={files.loading}
                uploading={files.uploading}
                filesError={files.error}
                uploadFile={files.uploadFile}
                downloadFile={files.downloadFile}
                deleteFile={files.deleteFile}
                refresh={files.refresh}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={auth.isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
