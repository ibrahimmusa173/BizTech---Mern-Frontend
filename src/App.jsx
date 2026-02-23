import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import EditProfile from './pages/EditProfile';

function App() {
  const { token, user_type } = useSelector((state) => state.auth);

  const getDashboardRoute = () => {
    const role = user_type?.toLowerCase();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'client') return '/client/dashboard';
    if (role === 'vendor') return '/vendor/dashboard';
    return '/profile';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Smart Root Redirect */}
        <Route 
          path="/" 
          element={
            token
              ? <Navigate to={getDashboardRoute()} replace />
              : <Navigate to="/login" replace />
          } 
        />

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