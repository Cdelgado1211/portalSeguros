import type { Quote } from '../types/quote';

export const mockQuotes: Quote[] = [
  {
    id: 'q-001',
    number: '123-BOAT-001',
    productType: 'BOATS',
    productName: 'Botes Recreativos',
    createdAt: '2026-01-15T09:00:00Z',
    premium: 18500,
    currency: 'MXN',
    status: 'APPROVED',
    customerName: 'Marina del Pacífico S.A. de C.V.',
    riskObjectName: 'Velero "Amanecer" 32 pies'
  },
  {
    id: 'q-002',
    number: '124-BOAT-002',
    productType: 'BOATS',
    productName: 'Botes Comerciales',
    createdAt: '2026-01-20T11:30:00Z',
    premium: 24800,
    currency: 'MXN',
    status: 'APPROVED',
    customerName: 'Tours Bahía Azul',
    riskObjectName: 'Lancha "Bahía Azul" 28 pies'
  },
  {
    id: 'q-003',
    number: '220-PATR-010',
    productType: 'PROPERTY',
    productName: 'Patrimoniales – Local Comercial',
    createdAt: '2026-01-18T15:45:00Z',
    premium: 9200,
    currency: 'MXN',
    status: 'DRAFT',
    customerName: 'Cafetería La Esquina',
    riskObjectName: 'Local Av. Reforma 120'
  },
  {
    id: 'q-004',
    number: '221-PATR-011',
    productType: 'PROPERTY',
    productName: 'Patrimoniales – Oficina',
    createdAt: '2026-01-12T10:10:00Z',
    premium: 13800,
    currency: 'MXN',
    status: 'APPROVED',
    customerName: 'Consultores del Centro',
    riskObjectName: 'Oficina Piso 7 Torre Centro'
  },
  {
    id: 'q-005',
    number: '300-AV-005',
    productType: 'AVIATION',
    productName: 'Aviación General',
    createdAt: '2026-01-05T08:00:00Z',
    premium: 89000,
    currency: 'MXN',
    status: 'APPROVED',
    customerName: 'AeroServicios del Norte',
    riskObjectName: 'Avión Cessna 208B'
  },
  {
    id: 'q-006',
    number: '301-AV-006',
    productType: 'AVIATION',
    productName: 'Aviación Ejecutiva',
    createdAt: '2025-12-28T17:20:00Z',
    premium: 152000,
    currency: 'MXN',
    status: 'EXPIRED',
    customerName: 'Grupo Empresarial del Sur',
    riskObjectName: 'Jet ejecutivo Gulfstream'
  },
  {
    id: 'q-007',
    number: '222-PATR-012',
    productType: 'PROPERTY',
    productName: 'Patrimoniales – Local Comercial',
    createdAt: '2026-01-22T13:05:00Z',
    premium: 7400,
    currency: 'MXN',
    status: 'APPROVED',
    customerName: 'Farmacia del Valle',
    riskObjectName: 'Local Plaza del Valle'
  }
];

