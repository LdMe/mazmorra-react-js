// Tests de la tarea react-06 (React Router).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import FichaMonstruo from '../../src/paginas/FichaMonstruo';
import Layout from '../../src/paginas/Layout';
import PaginaBestiario from '../../src/paginas/PaginaBestiario';
import { rutas } from '../../src/rutas';

/** Abre `direccion` con un router de memoria (sin navegador) y las rutas indicadas. */
function abrir(direccion, conRutas = rutas) {
  const router = createMemoryRouter(conRutas, { initialEntries: [direccion] });
  render(<RouterProvider router={router} />);
  return router;
}

// Rutas de prueba para probar el layout por separado, con páginas de mentira
const rutasLayout = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <p>Página de prueba: inicio</p> },
      { path: 'bestiario', element: <p>Página de prueba: bestiario</p> },
    ],
  },
];

// Rutas de prueba para probar las páginas del bestiario por separado
const rutasBestiario = [
  { path: '/', element: <p>Página de prueba: mazmorra</p> },
  { path: '/bestiario', element: <PaginaBestiario /> },
  { path: '/bestiario/:id', element: <FichaMonstruo /> },
];

const menu = () => within(screen.getByRole('navigation', { name: 'Menú principal' }));

beforeEach(() => {
  localStorage.clear();
  // La mazmorra tiene el bestiario de react-05, que pide datos a la API: aquí, un fetch que no responde nunca
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => {})),
  );
  // React Router avisa por consola de las rutas que no existen: aquí no interesa verlo
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Layout', () => {
  test('el menú enlaza con la mazmorra, el bestiario, la tienda y el gremio', () => {
    abrir('/bestiario', rutasLayout);
    expect(menu().getByRole('link', { name: /Mazmorra/ })).toHaveAttribute('href', '/');
    expect(menu().getByRole('link', { name: /Bestiario/ })).toHaveAttribute('href', '/bestiario');
    expect(menu().getByRole('link', { name: /Tienda/ })).toHaveAttribute('href', '/tienda');
    expect(menu().getByRole('link', { name: /Gremio/ })).toHaveAttribute('href', '/gremio');
  });

  test('solo se marca el enlace de la página actual', () => {
    abrir('/bestiario', rutasLayout);
    expect(menu().getByRole('link', { name: /Bestiario/ })).toHaveAttribute('aria-current', 'page');
    expect(menu().getByRole('link', { name: /Mazmorra/ })).not.toHaveAttribute('aria-current');
    expect(menu().getByRole('link', { name: /Tienda/ })).not.toHaveAttribute('aria-current');
  });

  test('la página actual se pinta debajo de la cabecera (Outlet)', () => {
    abrir('/bestiario', rutasLayout);
    expect(screen.getByRole('heading', { name: /La Mazmorra de React/ })).toBeInTheDocument();
    expect(screen.getByText('Página de prueba: bestiario')).toBeInTheDocument();
    expect(screen.queryByText('Página de prueba: inicio')).not.toBeInTheDocument();
  });
});

describe('Rutas', () => {
  test('en / está la mazmorra, con su enlace marcado', () => {
    abrir('/');
    // (con /…/ para que valga aunque el Panel de react-01 esté sin hacer: entonces el título sale en el 🚧)
    expect(screen.getByText(/Tu héroe/)).toBeInTheDocument();
    expect(menu().getByRole('link', { name: /Mazmorra/ })).toHaveAttribute('aria-current', 'page');
  });

  test('/bestiario lleva al bestiario', () => {
    abrir('/bestiario');
    expect(screen.getByRole('searchbox', { name: 'Buscar monstruo' })).toBeInTheDocument();
    expect(screen.queryByText(/Tu héroe/)).not.toBeInTheDocument();
  });

  test('/bestiario/:id lleva a la ficha del monstruo', () => {
    abrir('/bestiario/2');
    expect(screen.getByRole('heading', { name: 'Esqueleto' })).toBeInTheDocument();
  });

  test('/gremio lleva al gremio', () => {
    abrir('/gremio');
    expect(screen.getByText('Tablón de rumores')).toBeInTheDocument();
  });

  test('una dirección que no existe muestra la página de «perdido»', () => {
    abrir('/sotano-secreto');
    expect(screen.getByText(/Te has perdido en la mazmorra/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a la entrada/ })).toHaveAttribute('href', '/');
  });
});

describe('Bestiario y fichas', () => {
  test('cada monstruo enlaza con su ficha', () => {
    abrir('/bestiario', rutasBestiario);
    expect(screen.getByRole('link', { name: /Slime/ })).toHaveAttribute('href', '/bestiario/3');
    expect(screen.getByRole('link', { name: /Dragón/ })).toHaveAttribute('href', '/bestiario/6');
  });

  test('al pulsar un monstruo se abre su ficha', async () => {
    const usuario = userEvent.setup();
    const router = abrir('/bestiario', rutasBestiario);

    await usuario.click(screen.getByRole('link', { name: /Slime/ }));
    expect(router.state.location.pathname).toBe('/bestiario/3');
    expect(screen.getByText('Pegajoso. No lo pises.')).toBeInTheDocument();
  });

  test('la ficha es la del número de la dirección', () => {
    abrir('/bestiario/5', rutasBestiario);
    expect(screen.getByRole('heading', { name: 'Golem de piedra' })).toBeInTheDocument();
    expect(screen.getByText('Lento, pero casi indestructible.')).toBeInTheDocument();
  });

  test('si el número no existe, lo dice', () => {
    abrir('/bestiario/99', rutasBestiario);
    expect(screen.getByRole('alert')).toHaveTextContent('No hay ningún monstruo con el número 99');
  });

  test('el buscador filtra según la dirección (?buscar=)', () => {
    abrir('/bestiario?buscar=go', rutasBestiario);
    expect(screen.getByRole('searchbox', { name: 'Buscar monstruo' })).toHaveValue('go');
    expect(screen.getByText(/Goblin/)).toBeInTheDocument();
    expect(screen.getByText(/Golem de piedra/)).toBeInTheDocument();
    expect(screen.queryByText(/Slime/)).not.toBeInTheDocument();
  });

  test('al escribir en el buscador cambia la dirección', async () => {
    const usuario = userEvent.setup();
    const router = abrir('/bestiario', rutasBestiario);
    const buscador = screen.getByRole('searchbox', { name: 'Buscar monstruo' });

    await usuario.type(buscador, 'sli');
    expect(router.state.location.search).toBe('?buscar=sli');
    expect(screen.getByText(/Slime/)).toBeInTheDocument();
    expect(screen.queryByText(/Goblin/)).not.toBeInTheDocument();

    await usuario.clear(buscador);
    expect(router.state.location.search).toBe('');
  });

  test('«Luchar» lleva a la mazmorra con ese monstruo de rival', async () => {
    const usuario = userEvent.setup();
    const router = abrir('/bestiario/6', rutasBestiario);

    await usuario.click(screen.getByRole('button', { name: /Luchar contra Dragón/ }));
    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toBe('?rival=6');
    expect(screen.getByText('Página de prueba: mazmorra')).toBeInTheDocument();
  });
});
