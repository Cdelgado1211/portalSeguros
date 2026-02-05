# Atlas Emisión de Pólizas (Frontend)

Aplicación **React + TypeScript + TailwindCSS** (mobile-first) para agentes de **Seguros Atlas** encargados de la **emisión de pólizas** a partir de cotizaciones. La app está lista para desplegarse en **AWS Amplify** y usa una capa de API mockeada que se puede reemplazar fácilmente por endpoints reales.

> Nota de marca: esta app no incluye logotipos ni assets propietarios. El tema corporativo se basa en **tokens de diseño** configurables en `src/styles/theme.css` y `tailwind.config.cjs`. Consulta `THEME.md` para adaptar colores y tipografía.

## Tecnologías principales

- [Vite](https://vitejs.dev/) + React + TypeScript
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [@tanstack/react-query](https://tanstack.com/query/latest) para datos remotos y estado de cotizaciones
- [Vitest](https://vitest.dev/) + Testing Library para pruebas unitarias

## Requisitos previos

- Node.js 18+ recomendado
- npm 9+ (o pnpm/yarn adaptando los comandos)

## Instalación

```bash
npm install
```

### Scripts disponibles

- `npm run dev` – inicia el servidor de desarrollo en modo Vite.
- `npm run build` – genera el build de producción en `dist/`.
- `npm run preview` – sirve el build de producción localmente.
- `npm run test` – ejecuta las pruebas con Vitest.

## Configuración de entorno

La app está lista para usar un backend real mediante una variable de entorno:

- `VITE_API_BASE_URL`: URL base del backend REST (por ejemplo, `https://api.seguroatlas.com`).

Si **no** se define `VITE_API_BASE_URL`, la app usará automáticamente el **mock local** definido en `src/api/mockApi.ts` y los datos de `src/mocks/`.

Ejemplo de `.env`:

```bash
VITE_API_BASE_URL=https://api.mi-backend.com
```

> Importante: actualmente las funciones de la capa `src/api/` están implementadas con mocks, pero el archivo contiene comentarios `TODO` indicando dónde conectar endpoints reales.

## Estructura de carpetas

```text
src/
  api/        # Capa de acceso a API (mock + hook para futuro backend)
  components/ # Componentes reutilizables (UI, stepper, toasts, modales, etc.)
  hooks/      # Hooks de sesión, React Query y helpers
  layouts/    # Layouts (estructura general y barras superiores)
  mocks/      # Datos simulados de cotizaciones y usuarios
  pages/      # Páginas del flujo: Login, Cotizaciones, Emisión, Póliza
  styles/     # Tokens de diseño y estilos globales
  types/      # Tipos TypeScript compartidos
  utils/      # Utilidades generales (delay, formateos, imagen, etc.)
```

## Flujo funcional principal

1. **Login (`/login`)**
   - Usuario y contraseña, con opción “Recordarme” (solo UI).
   - Al iniciar sesión correctamente, redirige a `/quotes`.

2. **Lista de cotizaciones (`/quotes`)**
   - Listado mobile-first con tarjetas que muestran:
     - número de cotización,
     - producto (Botes / Patrimoniales / Aviones),
     - fecha,
     - prima,
     - estatus.
   - Filtro por producto y búsqueda por número.
   - Botón “Emitir póliza” en cada tarjeta.

3. **Detalle de cotización (`/quotes/:id`)**
   - Resumen de la cotización.
   - Botón “Emitir póliza” o “Continuar emisión” si ya hay una emisión en curso.

4. **Asistente de emisión (`/issuance/:issuanceId`)**
   - Wizard de pasos: **Datos → Ubicación → Fotos → Revisión → Confirmación**.
   - Los pasos de fotos se adaptan según el producto:
     - **Botes**: placa, casco, interiores, motor, panorámica.
     - **Patrimoniales/local**: fachada, interior, medidor, señalización, panorámica.
   - Paso Fotos utiliza `PhotoCapture` con `<input type="file" accept="image/*" capture="environment">`.
   - Validaciones por paso, guardado progresivo (mock) y feedback con toasts.
   - En Confirmación se muestra un diálogo de confirmación antes de emitir.

5. **Detalle de póliza (`/policies/:id`)**
   - Muestra datos básicos de la póliza emitida.
   - Link simulado al PDF de la póliza.
   - Mensaje de que se enviará correo con confirmación y PDF.

## Accesibilidad

- Formularios con `label` asociados y mensajes de error claros.
- Navegación por teclado soportada (focus visible, orden lógico).
- Diálogos con `aria-modal`, `role="dialog"` y manejo básico de foco.

## Despliegue en AWS Amplify

### 1. Configurar el repositorio

1. Sube este proyecto a un repositorio (GitHub / CodeCommit / GitLab).
2. En la consola de AWS Amplify, crea una nueva app conectada al repositorio.

### 2. Archivo `amplify.yml`

Este repo incluye un `amplify.yml` básico:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Amplify detectará este archivo automáticamente y usará `npm run build` para generar la carpeta `dist/`.

### 3. Configurar rewrites para SPA

React Router es una SPA, por lo que todas las rutas deben reescribirse a `index.html`.

En la consola de Amplify:

1. Ve a **App settings → Rewrites and redirects**.
2. Agrega una regla:

   - **Source address**: `</^((?!!).)*$/>`
   - **Target address**: `/index.html`
   - **Type**: 200 (Rewrite)

   o, de forma más simple:

   - **Source address**: `/<*>`
   - **Target address**: `/index.html`
   - **Type**: 200 (Rewrite)

De esta manera, rutas como `/quotes/123` o `/issuance/abc` se servirán correctamente.

## Pruebas

Las pruebas se definen con Vitest + Testing Library (ver archivos en `src/components/__tests__/` y similares).

Ejecutar:

```bash
npm run test
```

## Personalización de diseño

Revisa `THEME.md` para ver cómo adaptar:

- colores corporativos,
- tipografías,
- tokens adicionales de la marca (info, warning, etc.).

Puedes revisar también los componentes base en `src/components/` (botones, tarjetas, stepper, toasts) para mantener consistencia visual al agregar nuevas pantallas o flujos.

