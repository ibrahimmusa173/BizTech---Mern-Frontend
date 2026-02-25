import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user_type } = useSelector((state) => state.auth);

  // 1. Not logged in? Go to Login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but data is missing? Go to Login to refresh data.
  if (!user_type) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check Role (Case Insensitive)
  if (allowedRoles) {
    // Convert both the user's role and the allowed roles to lowercase for comparison
    const userRole = user_type.toLowerCase();
    const allowed = allowedRoles.map(role => role.toLowerCase());
    
    if (!allowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;