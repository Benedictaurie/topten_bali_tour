// src/components/global/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], // ['admin'], ['user'], atau ['admin', 'user']
  requireVerification = true // Default true, tapi admin bisa bypass
}) => {
  const { user, loading, needsVerification, isAdmin, isUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // =============================================
  // 1. CEK LOGIN: Semua protected route butuh login
  // =============================================
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // =============================================
  // 2. CEK ROLE: Jika ada requiredRoles
  // =============================================
  if (requiredRoles.length > 0) {
    const hasRequiredRole = 
      (requiredRoles.includes('admin') && isAdmin()) ||
      (requiredRoles.includes('user') && isUser());
    
    if (!hasRequiredRole) {
      // Redirect berdasarkan role user yang login
      if (isAdmin()) {
        return <Navigate to="/admin" replace />;
      } else if (isUser()) {
        return <Navigate to="/" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // =============================================
  // 3. CEK VERIFIKASI EMAIL
  // =============================================
  if (requireVerification && needsVerification) {
    // Admin BOLEH BYPASS verifikasi email
    if (isAdmin()) {
      // Admin bisa akses meski belum verify email
      return children;
    }
    
    // User biasa: perlu verifikasi email
    // Jika belum di halaman verify-email, redirect ke sana
    if (location.pathname !== '/verify-email') {
      return <Navigate to="/verify-email" state={{ from: location }} replace />;
    }
  }

  // =============================================
  // 4. SEMUA CHECK PASSED → BERI AKSES
  // =============================================
  return children;
};

export default ProtectedRoute;