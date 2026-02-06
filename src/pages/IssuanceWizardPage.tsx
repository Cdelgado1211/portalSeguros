import { FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Stepper, type Step } from '../components/Stepper';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { PhotoCapture, type CapturedPhoto } from '../components/PhotoCapture';
import { ConfirmModal } from '../components/Modal';
import { useToast } from '../components/ToastProvider';
import { issuePolicy, submitIssuanceStep, uploadPhoto } from '../api';
import type { Quote } from '../types/quote';
import type { IssuanceFormData } from '../types/issuance';
import { compressImageIfNeeded } from '../utils/image';

const steps: Step[] = [
  { key: 'DATA', label: 'Datos' },
  { key: 'LOCATION', label: 'Ubicación' },
  { key: 'PHOTOS', label: 'Fotos' },
  { key: 'REVIEW', label: 'Revisión' },
  { key: 'CONFIRM', label: 'Confirmación' }
];

interface LocationState {
  quote?: Quote;
}

const getPhotoRequirements = (productType: Quote['productType']) => {
  if (productType === 'BOATS') {
    return [
      { id: 'plate', label: 'Placa del bote', description: 'Foto clara de la placa o matrícula.' },
      { id: 'hull', label: 'Casco', description: 'Vista lateral del casco.' },
      { id: 'interior', label: 'Interiores', description: 'Cabina y zona de pasajeros.' },
      { id: 'engine', label: 'Motor', description: 'Vista del motor principal.' },
      { id: 'panoramic', label: 'Panorámica', description: 'Vista general de la embarcación.' }
    ];
  }
  if (productType === 'PROPERTY') {
    return [
      { id: 'facade', label: 'Fachada', description: 'Vista frontal del local.' },
      { id: 'interior', label: 'Interior', description: 'Vista general del interior.' },
      { id: 'meter', label: 'Medidor', description: 'Fotografía del medidor de luz.' },
      { id: 'signage', label: 'Señalización', description: 'Salidas de emergencia / extintores.' },
      { id: 'panoramic', label: 'Panorámica', description: 'Vista amplia del local y entorno.' }
    ];
  }
  // Fallback genérico
  return [
    { id: 'front', label: 'Frontal', description: 'Vista frontal del riesgo.' },
    { id: 'side', label: 'Lateral', description: 'Vista lateral del riesgo.' },
    { id: 'serial', label: 'Serie / placa', description: 'Número de serie o identificación.' },
    { id: 'details', label: 'Detalles', description: 'Área crítica o detalles relevantes.' },
    { id: 'panoramic', label: 'Panorámica', description: 'Vista general y contexto.' }
  ];
};

const IssuanceWizardPage = () => {
  const { issuanceId } = useParams<{ issuanceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { quote } = (location.state as LocationState) || {};
  const { showToast } = useToast();

  const [activeIndex, setActiveIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<IssuanceFormData>(() => ({
    common: {
      insuredName: quote?.customerName ?? '',
      insuredEmail: ''
    },
    location: {
      addressLine: '',
      city: '',
      state: '',
      postalCode: ''
    },
    boat:
      quote?.productType === 'BOATS'
        ? {
            boatBrand: '',
            boatModel: '',
            boatLength: '',
            registration: ''
          }
        : undefined,
    property:
      quote?.productType === 'PROPERTY'
        ? {
            businessName: quote?.riskObjectName ?? '',
            activity: '',
            squareMeters: ''
          }
        : undefined
  }));

  const [photos, setPhotos] = useState<Record<string, CapturedPhoto | null>>({});

  const photoRequirements = useMemo(
    () => getPhotoRequirements(quote?.productType ?? 'PROPERTY'),
    [quote?.productType]
  );

  if (!quote || !issuanceId) {
    return (
      <div className="mt-4 text-xs text-danger">
        No se pudo cargar la emisión. Vuelve al detalle de la cotización.
      </div>
    );
  }

  const goNext = async () => {
    if (!(await validateStep())) return;
    if (activeIndex < steps.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const validateStep = async (): Promise<boolean> => {
    const key = steps[activeIndex].key;
    if (key === 'DATA') {
      if (!formData.common.insuredName.trim()) {
        showToast({
          type: 'error',
          title: 'Completa los datos del asegurado',
          description: 'El nombre del asegurado es obligatorio.'
        });
        return false;
      }
      if (!formData.common.insuredEmail?.trim()) {
        showToast({
          type: 'error',
          title: 'Captura el correo del asegurado',
          description: 'Necesitamos un correo para enviar la confirmación.'
        });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.common.insuredEmail)) {
        showToast({
          type: 'error',
          title: 'Correo electrónico inválido',
          description: 'Verifica el formato del correo del asegurado.'
        });
        return false;
      }
    }
    if (key === 'LOCATION') {
      if (
        !formData.location.addressLine.trim() ||
        !formData.location.city.trim() ||
        !formData.location.state.trim() ||
        !formData.location.postalCode.trim()
      ) {
        showToast({
          type: 'error',
          title: 'Completa la ubicación',
          description: 'Dirección, ciudad, estado y CP son obligatorios.'
        });
        return false;
      }
    }
    if (key === 'PHOTOS') {
      const missing = photoRequirements.filter((req) => !photos[req.id]);
      if (missing.length > 0) {
        showToast({
          type: 'error',
          title: 'Faltan fotografías',
          description: 'Debes capturar las fotos indicadas para continuar.'
        });
        return false;
      }
      // Guardado progresivo de fotos
      for (const req of photoRequirements) {
        const captured = photos[req.id];
        if (captured) {
          const compressed = await compressImageIfNeeded(captured.file);
          await uploadPhoto(issuanceId, req.id, compressed);
        }
      }
    }
    // Guardado progresivo del formulario
    await submitIssuanceStep(issuanceId, {
      data: formData
    });
    return true;
  };

  const handleSubmitReview = async (event: FormEvent) => {
    event.preventDefault();
    await goNext();
  };

  const handleConfirmIssue = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      const policy = await issuePolicy(issuanceId);
      showToast({
        type: 'success',
        title: 'Póliza emitida',
        description: 'Se enviará un correo con la confirmación y el PDF.'
      });
      navigate(`/policies/${policy.id}`, { replace: true });
    } catch (error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'No se pudo emitir la póliza'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentKey = steps[activeIndex].key;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={goBack}
        className="mb-1 text-left text-xs text-slate-500"
      >
        ← Volver
      </button>
      <h1 className="px-1 text-lg font-semibold text-secondary">Emisión de póliza</h1>
      <p className="px-1 text-[11px] text-slate-500">
        {quote.productName} • {quote.number}
      </p>

      <Stepper steps={steps} activeIndex={activeIndex} />

      <Card className="space-y-3">
        {currentKey === 'DATA' && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void goNext();
            }}
          >
            <p className="text-xs font-semibold text-slate-700">Datos del asegurado</p>
            <Input
              label="Nombre / razón social"
              value={formData.common.insuredName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  common: { ...prev.common, insuredName: e.target.value }
                }))
              }
            />
            <Input
              label="RFC"
              value={formData.common.insuredRfc ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  common: { ...prev.common, insuredRfc: e.target.value }
                }))
              }
            />
            <Input
              label="Correo electrónico del asegurado"
              type="email"
              value={formData.common.insuredEmail ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  common: { ...prev.common, insuredEmail: e.target.value }
                }))
              }
              placeholder="nombre@cliente.com"
            />

            {quote.productType === 'BOATS' && (
              <>
                <p className="pt-1 text-xs font-semibold text-slate-700">Datos de la embarcación</p>
                <Input
                  label="Marca"
                  value={formData.boat?.boatBrand ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      boat: { ...(prev.boat ?? {}), boatBrand: e.target.value }
                    }))
                  }
                />
                <Input
                  label="Modelo"
                  value={formData.boat?.boatModel ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      boat: { ...(prev.boat ?? {}), boatModel: e.target.value }
                    }))
                  }
                />
                <Input
                  label="Eslora (ft)"
                  value={formData.boat?.boatLength ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      boat: { ...(prev.boat ?? {}), boatLength: e.target.value }
                    }))
                  }
                />
                <Input
                  label="Matrícula"
                  value={formData.boat?.registration ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      boat: { ...(prev.boat ?? {}), registration: e.target.value }
                    }))
                  }
                />
              </>
            )}

            {quote.productType === 'PROPERTY' && (
              <>
                <p className="pt-1 text-xs font-semibold text-slate-700">Datos del local</p>
                <Input
                  label="Nombre comercial"
                  value={formData.property?.businessName ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      property: { ...(prev.property ?? {}), businessName: e.target.value }
                    }))
                  }
                />
                <Input
                  label="Giro / actividad"
                  value={formData.property?.activity ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      property: { ...(prev.property ?? {}), activity: e.target.value }
                    }))
                  }
                />
                <Input
                  label="Superficie (m²)"
                  value={formData.property?.squareMeters ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      property: { ...(prev.property ?? {}), squareMeters: e.target.value }
                    }))
                  }
                />
              </>
            )}

            <div className="pt-2">
              <Button type="submit" fullWidth>
                Siguiente: Ubicación
              </Button>
            </div>
          </form>
        )}

        {currentKey === 'LOCATION' && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void goNext();
            }}
          >
            <p className="text-xs font-semibold text-slate-700">Ubicación del riesgo</p>
            <Input
              label="Dirección"
              value={formData.location.addressLine}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, addressLine: e.target.value }
                }))
              }
            />
            <Input
              label="Ciudad"
              value={formData.location.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))
              }
            />
            <Input
              label="Estado"
              value={formData.location.state}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, state: e.target.value }
                }))
              }
            />
            <Input
              label="Código postal"
              value={formData.location.postalCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, postalCode: e.target.value }
                }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Latitud (opcional)"
                value={formData.location.latitude ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, latitude: e.target.value }
                  }))
                }
              />
              <Input
                label="Longitud (opcional)"
                value={formData.location.longitude ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, longitude: e.target.value }
                  }))
                }
              />
            </div>
            <div className="mt-2 rounded-2xl border border-dashed border-border bg-slate-50 p-3 text-[11px] text-slate-500">
              <p className="font-medium text-slate-600">Mapa de referencia</p>
              <p className="mt-1">
                Aquí se puede integrar en el futuro un mapa interactivo (Google Maps u otro
                proveedor). Por ahora es un placeholder visual.
              </p>
              <div className="mt-2 h-24 rounded-xl bg-slate-200" />
            </div>
            <div className="pt-2">
              <Button type="submit" fullWidth>
                Siguiente: Fotos
              </Button>
            </div>
          </form>
        )}

        {currentKey === 'PHOTOS' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700">Levantamiento fotográfico</p>
            <p className="text-[11px] text-slate-500">
              Captura las fotografías solicitadas. Verifica que sean claras y legibles antes de
              continuar.
            </p>
            <div className="space-y-3">
              {photoRequirements.map((req) => (
                <PhotoCapture
                  key={req.id}
                  label={req.label}
                  description={req.description}
                  photo={photos[req.id] ?? null}
                  onChange={(p) =>
                    setPhotos((prev) => ({
                      ...prev,
                      [req.id]: p
                    }))
                  }
                />
              ))}
            </div>
            <div className="pt-2">
              <Button type="button" fullWidth onClick={() => void goNext()}>
                Siguiente: Revisión
              </Button>
            </div>
          </div>
        )}

        {currentKey === 'REVIEW' && (
          <form className="space-y-3" onSubmit={handleSubmitReview}>
            <p className="text-xs font-semibold text-slate-700">Revisión final</p>
            <p className="text-[11px] text-slate-500">
              Verifica que la información capturada sea correcta antes de emitir la póliza.
            </p>
            <div className="rounded-2xl border border-border bg-surface p-3 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-700">Asegurado</p>
              <p className="mt-0.5">{formData.common.insuredName}</p>
              {formData.common.insuredRfc && <p>RFC: {formData.common.insuredRfc}</p>}
              {formData.common.insuredEmail && (
                <p>Correo: {formData.common.insuredEmail}</p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-3 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-700">Ubicación</p>
              <p className="mt-0.5">{formData.location.addressLine}</p>
              <p>
                {formData.location.city}, {formData.location.state} C.P. {formData.location.postalCode}
              </p>
              {(formData.location.latitude || formData.location.longitude) && (
                <p>
                  Lat/Lng: {formData.location.latitude || '—'} /{' '}
                  {formData.location.longitude || '—'}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-3 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-700">Fotografías</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {photoRequirements.map((req) => {
                  const photo = photos[req.id];
                  return (
                    <div
                      key={req.id}
                      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-alt p-1.5"
                    >
                      <div className="h-14 w-full overflow-hidden rounded-lg bg-slate-100">
                        {photo?.previewUrl ? (
                          <img
                            src={photo.previewUrl}
                            alt={req.label}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <span className="line-clamp-2 text-center text-[9px] text-slate-600">
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth>
                Continuar a confirmación
              </Button>
            </div>
          </form>
        )}

        {currentKey === 'CONFIRM' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700">Confirmación de emisión</p>
            <p className="text-[11px] text-slate-500">
              Al confirmar, se enviará la solicitud de emisión. La póliza quedará emitida y se
              enviará un correo al asegurado con el PDF de la póliza.
            </p>
            <div className="rounded-2xl border border-border bg-surface p-3 text-[11px] text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Asegurado:</span>{' '}
                {formData.common.insuredName}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Producto:</span> {quote.productName}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Cotización:</span> {quote.number}
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                fullWidth
                loading={submitting}
                onClick={() => setConfirmOpen(true)}
              >
                Emitir póliza
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        title="Confirmar emisión"
        description="¿Deseas emitir la póliza con la información capturada? Se enviará un correo de confirmación con el PDF."
        confirmLabel="Sí, emitir"
        cancelLabel="Cancelar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmIssue}
      />
    </div>
  );
};

export default IssuanceWizardPage;
