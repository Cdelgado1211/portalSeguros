import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { Button } from '../components/Button';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRootQuotes = location.pathname.startsWith('/quotes');

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-secondary/20 bg-secondary px-4 py-3 shadow-sm text-white">
        <div className="flex items-center gap-2">
          <img
            src="https://images.email-platform.com/segurosatlas/logo-web2-blanco-final(1).png"
            alt="Seguros Atlas"
            className="h-6 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-primary-muted">
              Emisión de pólizas
            </span>
            <span className="text-base font-semibold text-white">Atlas Emisión</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex flex-col text-right">
              <span className="text-xs text-primary-muted/90">Agente</span>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            aria-label="Cerrar sesión"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Salir
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col bg-surface px-3 py-3">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 flex border-t border-border bg-surface-alt px-4 py-2 text-xs text-slate-500">
        <button
          type="button"
          className={`flex-1 text-center ${isRootQuotes ? 'text-primary font-medium' : ''}`}
          onClick={() => navigate('/quotes')}
        >
          Cotizaciones
        </button>
      </nav>
    </div>
  );
};
