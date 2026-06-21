// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Removed Navigate as it's not needed for the root anymore
import ProtectedRoute from './components/ProtectedRoute';


import AuthSuccess from './pages/AuthSuccess';

// Import the new Home page
import Home from './pages/Home'; 

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* UPDATED: Root path now shows the Landing Page */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        
        {/* ... (Keep the rest of your ProtectedRoutes the same) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/client/dashboard" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } />

        <Route path="/vendor/dashboard" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

         <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <h1 className="text-2xl">Access Denied</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;