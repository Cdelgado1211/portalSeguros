import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../hooks/useQuotes';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Skeleton } from '../components/Skeleton';
import { formatCurrency, formatDate } from '../utils/format';
import type { Quote } from '../types/quote';

const productFilterOptions = [
  { value: 'ALL', label: 'Todos los productos' },
  { value: 'BOATS', label: 'Botes' },
  { value: 'PROPERTY', label: 'Patrimoniales' },
  { value: 'AVIATION', label: 'Aviones' }
] as const;

const QuotesListPage = () => {
  const { data, isLoading } = useQuotes();
  const [productFilter, setProductFilter] = useState<(typeof productFilterOptions)[number]['value']>(
    'ALL'
  );
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredQuotes = useMemo(() => {
    if (!data) return [];
    return data.filter((quote) => {
      const matchesProduct =
        productFilter === 'ALL' ? true : quote.productType === productFilter;
      const matchesSearch =
        !search.trim() ||
        quote.number.toLowerCase().includes(search.toLowerCase()) ||
        quote.customerName.toLowerCase().includes(search.toLowerCase());
      return matchesProduct && matchesSearch;
    });
  }, [data, productFilter, search]);

  const renderStatusChip = (quote: Quote) => {
    const baseClasses =
      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium';
    switch (quote.status) {
      case 'APPROVED':
        return (
          <span className={`${baseClasses} bg-emerald-50 text-success`}>Aprobada</span>
        );
      case 'DRAFT':
        return <span className={`${baseClasses} bg-slate-100 text-slate-600`}>Borrador</span>;
      case 'EXPIRED':
        return <span className={`${baseClasses} bg-rose-50 text-danger`}>Vencida</span>;
      case 'ISSUED':
        return <span className={`${baseClasses} bg-primary-muted text-primary`}>Emitida</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="px-1 text-lg font-semibold text-secondary">Cotizaciones</h1>
      <div className="flex flex-col gap-2 rounded-2xl bg-surface-alt p-3 shadow-sm">
        <Input
          label="Buscar"
          placeholder="Número de cotización o cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Producto"
          value={productFilter}
          onChange={(e) =>
            setProductFilter(e.target.value as (typeof productFilterOptions)[number]['value'])
          }
        >
          {productFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!isLoading && filteredQuotes.length === 0 && (
        <p className="mt-4 px-1 text-xs text-slate-500">
          No se encontraron cotizaciones con los filtros seleccionados.
        </p>
      )}

      <div className="flex flex-col gap-3 pb-4">
        {filteredQuotes.map((quote) => (
          <button
            key={quote.id}
            type="button"
            onClick={() => navigate(`/quotes/${quote.id}`)}
            className="text-left"
          >
            <Card className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-secondary">{quote.number}</p>
                  <p className="text-[11px] text-slate-500">{quote.productName}</p>
                </div>
                {renderStatusChip(quote)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700">
                    {formatCurrency(quote.premium, quote.currency)}
                  </span>
                  <span>Prima anual</span>
                </div>
                <div className="flex flex-col items-end">
                  <span>{formatDate(quote.createdAt)}</span>
                  <span className="truncate max-w-[160px]">{quote.customerName}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quotes/${quote.id}`);
                  }}
                >
                  Emitir póliza
                </Button>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuotesListPage;

