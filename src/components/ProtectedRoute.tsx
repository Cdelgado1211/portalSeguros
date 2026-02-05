import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="text-sm text-slate-500">Cargando sesión…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

