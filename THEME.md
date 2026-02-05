# THEME – Sistema de diseño corporativo (Atlas-like)

Este proyecto usa **tokens de diseño** basados en variables CSS y utilidades de Tailwind para representar la identidad visual de Seguros Atlas (o cualquier aseguradora similar). La idea es que sea sencillo reemplazar colores y tipografías cuando se tengan los valores oficiales.

## Dónde se definen los tokens

Los tokens principales están en:

- `src/styles/theme.css` – Variables CSS (`--atlas-*`)
- `tailwind.config.cjs` – Colores de Tailwind que apuntan a esas variables

### Variables CSS

En `src/styles/theme.css` encontrarás algo como:

```css
:root {
  --atlas-primary: #b3261e;
  --atlas-primary-muted: #fbeaea;
  --atlas-secondary: #143b64;
  --atlas-accent: #d97706;

  --atlas-surface: #f4f5f7;
  --atlas-surface-alt: #ffffff;
  --atlas-border: #d0d7e2;

  --atlas-danger: #b91c1c;
  --atlas-success: #15803d;

  --atlas-radius-card: 1.25rem;
}
```

Estas variables definen la paleta y algunos tokens de forma/espaciado. Toda la app las usa a través de clases Tailwind como `bg-primary`, `text-secondary`, `bg-surface`, etc.

## Cómo cambiar colores corporativos

1. Abre `src/styles/theme.css`.
2. Actualiza los valores de las variables:
   - `--atlas-primary`: color principal de la marca (botones, links, acentos clave).
   - `--atlas-primary-muted`: versión suave para fondos, badges, estados.
   - `--atlas-secondary`: color de apoyo (headers, barras superiores).
   - `--atlas-accent`: color de acento (etiquetas de estatus, elementos destacados).
   - `--atlas-surface` / `--atlas-surface-alt`: fondos de la app y tarjetas.
   - `--atlas-border`: color de bordes y divisores.
   - `--atlas-danger` / `--atlas-success`: errores y estados de éxito.
3. Guarda y ejecuta `npm run dev` para ver los cambios.

No es necesario tocar `tailwind.config.cjs` para cambiar la paleta: mientras respetes los mismos nombres de variables (`--atlas-primary`, etc.), las clases Tailwind seguirán funcionando.

## Cómo cambiar tipografía

Actualmente se usa el stack de sistema definido en `src/styles/theme.css`:

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

Para usar una tipografía corporativa (ej. una fuente propia o de Google Fonts):

1. Importa la fuente en `index.html` o en `src/styles/theme.css`, por ejemplo:

   ```html
   <!-- index.html -->
   <link
     rel="stylesheet"
     href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
   />
   ```

2. Cambia la declaración `font-family` en `src/styles/theme.css`:

   ```css
   body {
     font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
   }
   ```

3. Si quieres tokens de tipografía más avanzados (tamaños, pesos), puedes definir variables extra:

   ```css
   :root {
     --atlas-font-size-body: 0.95rem;
     --atlas-font-size-heading: 1.4rem;
     --atlas-font-weight-strong: 600;
   }
   ```

   Y luego usarlas en las clases utilitarias de Tailwind con `[var(--...)]` cuando sea necesario.

## Uso de los tokens en componentes

La mayoría de los componentes usan clases Tailwind que ya apuntan a los tokens:

- Botones primarios: `bg-primary text-white hover:bg-secondary`
- Cabeceras: `text-secondary`
- Tarjetas: `bg-surface-alt shadow-card rounded-xl border border-border`
- Fondos generales: `bg-surface`

Cuando cambies la paleta, estos componentes se actualizarán automáticamente.

## Extender el sistema de diseño

Si necesitas más tokens corporativos:

1. Agrega nuevas variables en `src/styles/theme.css`, por ejemplo:

   ```css
   :root {
     --atlas-info: #2563eb;
   }
   ```

2. Mapea esos tokens en `tailwind.config.cjs`:

   ```js
   extend: {
     colors: {
       info: 'var(--atlas-info)'
     }
   }
   ```

3. Usa las nuevas utilidades en la UI: `bg-info`, `text-info`, `border-info`, etc.

De esta forma, cuando el equipo de diseño entregue la guía oficial de Seguros Atlas, solo tendrás que actualizar las variables y, si hace falta, extender el mapeo en Tailwind.

