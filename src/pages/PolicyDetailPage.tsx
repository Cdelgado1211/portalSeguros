import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicy } from '../api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { formatDate } from '../utils/format';

const PolicyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', id],
    queryFn: () => getPolicy(id ?? ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="mt-4 text-xs text-danger">
        No se encontró la póliza. Vuelve a tus cotizaciones.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => navigate('/quotes')}
        className="mb-1 text-left text-xs text-slate-500"
      >
        ← Volver a cotizaciones
      </button>
      <h1 className="px-1 text-lg font-semibold text-secondary">Póliza emitida</h1>
      <Card className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-secondary">{policy.policyNumber}</p>
            <p className="text-[11px] text-slate-500">{policy.productName}</p>
          </div>
          <p className="text-xs text-slate-500">Vigencia</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div>
            <p className="text-[11px] font-medium text-slate-700">Asegurado</p>
            <p>{policy.insuredName}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">Vigencia</p>
            <p>
              {formatDate(policy.effectiveDate)} – {formatDate(policy.expiryDate)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">ID póliza</p>
            <p>{policy.id}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">Correo de confirmación</p>
            <p>{policy.emailSent ? 'Enviado' : 'Pendiente'}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-2">
        <p className="text-xs text-slate-600">
          Se enviará un correo de confirmación al asegurado con el PDF de la póliza adjunto. Desde
          aquí también puedes consultar el documento.
        </p>
        <Button
          as="a" // TypeScript no sabe de esto, pero es solo para estilos; se ignorará
          href={policy.pdfUrl}
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          fullWidth
        >
          Ver PDF de póliza
        </Button>
      </Card>
    </div>
  );
};

export default PolicyDetailPage;

