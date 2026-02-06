import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/auth';
import { useToast } from '../components/ToastProvider';
import { Card } from '../components/Card';

interface LocationState {
  from?: Location;
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | undefined)?.from?.pathname ?? '/quotes';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'Ingresa tu usuario';
    if (!password.trim()) newErrors.password = 'Ingresa tu contraseña';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await login(username, password, remember);
      showToast({
        type: 'success',
        title: 'Bienvenido',
        description: 'Sesión iniciada correctamente'
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'Error de autenticación',
        description: 'Revisa tu usuario y contraseña'
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary via-secondary to-primary px-4">
      <div className="w-full max-w-sm">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
          <div className="mb-4 pt-4 text-center">
            <div className="mb-2 flex justify-center">
              <img
                src="https://images.email-platform.com/segurosatlas/logo-web2-blanco-final(1).png"
                alt="Seguros Atlas"
                className="h-8 w-auto"
              />
            </div>
            <h1 className="text-lg font-semibold text-secondary">Atlas Emisión</h1>
            <p className="mt-1 text-xs text-slate-500">
              Acceso para agentes – emisión de pólizas
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Usuario"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              placeholder="ej. mlopez"
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />
            <label className="mt-1 flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme en este dispositivo
            </label>
            <Button type="submit" fullWidth loading={isLoading} className="mt-2">
              Iniciar sesión
            </Button>
          </form>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Ambiente de demostración – las credenciales son validadas contra un mock local.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
