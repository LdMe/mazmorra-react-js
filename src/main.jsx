import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import MonederoProvider from './contexto/MonederoProvider';
import './index.css';
import { rutas } from './rutas';

// El router se crea una sola vez, fuera de cualquier componente (tema 11, "Configuración básica").
// Las rutas están en src/rutas (react-06).
const router = createBrowserRouter(rutas);

// MonederoProvider (react-07) envuelve al router: así el oro es el mismo en todas las páginas
// y no se pierde al navegar.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MonederoProvider>
      <RouterProvider router={router} />
    </MonederoProvider>
  </StrictMode>,
);
