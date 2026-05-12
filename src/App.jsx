import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import EditProfile from './pages/EditProfile';
import ActiveTenders from './pages/vendor/ActiveTenders';
import MyProposals from './pages/vendor/MyProposals';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
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

        <Route path="/vendor/active-tenders" element={<ActiveTenders />} />
        <Route path="/vendor/my-proposals" element={<MyProposals />} />

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