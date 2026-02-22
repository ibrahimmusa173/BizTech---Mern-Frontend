import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user_type } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles) {
    const normalizedUserRole = user_type?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === normalizedUserRole);

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;