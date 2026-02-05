import { useNavigate, useParams } from 'react-router-dom';
import { useQuote } from '../hooks/useQuotes';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { formatCurrency, formatDate } from '../utils/format';
import { startIssuance } from '../api';
import { useToast } from '../components/ToastProvider';

const QuoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quote, isLoading } = useQuote(id ?? '');
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!quote) {
    return (
      <p className="mt-4 text-xs text-danger">
        No se encontró la cotización solicitada. Regresa al listado.
      </p>
    );
  }

  const handleStartIssuance = async () => {
    try {
      const issuance = await startIssuance(quote.id);
      showToast({
        type: 'info',
        title: 'Emisión iniciada',
        description: 'Completa los pasos para emitir la póliza'
      });
      navigate(`/issuance/${issuance.id}`, { state: { quote } });
    } catch (error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'No se pudo iniciar la emisión'
      });
    }
  };

  const handleContinueIssuance = () => {
    if (!quote.ongoingIssuanceId) return;
    navigate(`/issuance/${quote.ongoingIssuanceId}`, { state: { quote } });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => navigate('/quotes')}
        className="mb-1 text-left text-xs text-slate-500"
      >
        ← Volver a cotizaciones
      </button>
      <h1 className="px-1 text-lg font-semibold text-secondary">Detalle de cotización</h1>
      <Card className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-secondary">{quote.number}</p>
            <p className="text-[11px] text-slate-500">{quote.productName}</p>
          </div>
          <p className="text-xs text-slate-500">{formatDate(quote.createdAt)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div>
            <p className="text-[11px] font-medium text-slate-700">Cliente</p>
            <p>{quote.customerName}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">Objeto asegurado</p>
            <p>{quote.riskObjectName}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">Prima</p>
            <p>{formatCurrency(quote.premium, quote.currency)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-700">Estatus</p>
            <p>{quote.status}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-2">
        <p className="text-xs text-slate-600">
          Al emitir la póliza se solicitará información adicional (datos del riesgo, ubicación y
          un levantamiento fotográfico guiado). Podrás revisar el resumen antes de confirmar.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Button onClick={handleStartIssuance}>
            {quote.ongoingIssuanceId ? 'Reiniciar emisión' : 'Emitir póliza'}
          </Button>
          {quote.ongoingIssuanceId && (
            <Button variant="secondary" onClick={handleContinueIssuance}>
              Continuar emisión en curso
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuoteDetailPage;

