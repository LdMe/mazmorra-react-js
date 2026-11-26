// Tests de la tarea react-07 (Context, useReducer, useRef y hooks propios).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Monedero from '../../src/componentes/Monedero';
import Tienda from '../../src/componentes/Tienda';
import MonederoProvider from '../../src/contexto/MonederoProvider';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';
import { useMonedero } from '../../src/hooks/useMonedero';
import { estadoInicialMonedero, monederoReducer } from '../../src/logica/monedero';

const pocion = {
  id: 'p',
  nombre: 'Poción',
  icono: '🧪',
  tipo: 'pocion',
  rareza: 'comun',
  valor: 30,
};
const espada = { id: 'e', nombre: 'Espada', icono: '🗡️', tipo: 'arma', rareza: 'rara', valor: 80 };

// Cada test empieza sin nada guardado (el monedero y useLocalStorage usan localStorage)
beforeEach(() => {
  localStorage.clear();
});

/** Pinta los componentes dentro del proveedor del monedero. */
const conMonedero = (contenido) => render(<MonederoProvider>{contenido}</MonederoProvider>);

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('sin nada guardado, empieza con el valor inicial y lo guarda', () => {
    const { result } = renderHook(() => useLocalStorage('prueba', { oro: 5 }));
    expect(result.current[0]).toEqual({ oro: 5 });
    expect(localStorage.getItem('prueba')).toBe('{"oro":5}');
  });

  test('recupera lo que había guardado (en JSON)', () => {
    localStorage.setItem('prueba', JSON.stringify(['espada', 'escudo']));
    const { result } = renderHook(() => useLocalStorage('prueba', []));
    expect(result.current[0]).toEqual(['espada', 'escudo']);
  });

  test('cada cambio se guarda en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('prueba', 1));
    act(() => result.current[1](7));
    expect(result.current[0]).toBe(7);
    expect(localStorage.getItem('prueba')).toBe('7');
  });
});

describe('monederoReducer', () => {
  test('GANAR suma el oro sin modificar el estado anterior', () => {
    const anterior = { oro: 10, compras: [] };
    const nuevo = monederoReducer(anterior, { type: 'GANAR', payload: 25 });
    expect(nuevo.oro).toBe(35);
    expect(anterior.oro).toBe(10);
  });

  test('COMPRAR resta el valor y añade el objeto a las compras', () => {
    const nuevo = monederoReducer(
      { oro: 100, compras: [pocion] },
      { type: 'COMPRAR', payload: espada },
    );
    expect(nuevo).toEqual({ oro: 20, compras: [pocion, espada] });
  });

  test('COMPRAR no hace nada si no llega el oro', () => {
    const pobre = { oro: 50, compras: [] };
    expect(monederoReducer(pobre, { type: 'COMPRAR', payload: espada })).toBe(pobre);
    expect(monederoReducer(pobre, { type: 'COMPRAR', payload: pocion }).oro).toBe(20);
  });

  test('REINICIAR vuelve al estado inicial', () => {
    expect(monederoReducer({ oro: 3, compras: [espada] }, { type: 'REINICIAR' })).toEqual(
      estadoInicialMonedero,
    );
  });
});

describe('Monedero compartido (Context)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('useMonedero avisa con un error si no hay <MonederoProvider>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useMonedero())).toThrow(/MonederoProvider/);
  });

  test('el monedero se guarda en localStorage y se recupera', () => {
    const primero = renderHook(() => useMonedero(), { wrapper: MonederoProvider });
    act(() => primero.result.current.ganar(50));
    primero.unmount();

    const segundo = renderHook(() => useMonedero(), { wrapper: MonederoProvider });
    expect(segundo.result.current.oro).toBe(150);
  });

  test('dentro del proveedor, useMonedero da el oro y las compras', () => {
    const { result } = renderHook(() => useMonedero(), { wrapper: MonederoProvider });
    expect(result.current.oro).toBe(100);
    expect(result.current.compras).toEqual([]);

    act(() => result.current.ganar(50));
    expect(result.current.oro).toBe(150);
  });

  test('lo que compra la tienda lo ve el monedero', async () => {
    const usuario = userEvent.setup();
    conMonedero(
      <>
        <Monedero onComprado={vi.fn()} />
        <Tienda onComprado={vi.fn()} />
      </>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Comprar Escudo de hierro' }));
    expect(screen.getByText('55')).toBeInTheDocument();
  });
});

describe('Monedero', () => {
  test('muestra el oro del monedero compartido', () => {
    conMonedero(<Monedero onComprado={vi.fn()} />);
    expect(screen.getByText(/monedas de oro/)).toHaveTextContent('🪙 100 monedas de oro');
  });

  test('compra las pociones del campo, vacía el campo y le devuelve el foco', async () => {
    const usuario = userEvent.setup();
    const onComprado = vi.fn();
    conMonedero(<Monedero onComprado={onComprado} />);
    const campo = screen.getByLabelText(/Pociones de vida/);

    await usuario.type(campo, '3');
    await usuario.click(screen.getByRole('button', { name: 'Comprar' }));

    expect(screen.getByText(/monedas de oro/)).toHaveTextContent('70');
    expect(onComprado).toHaveBeenCalledTimes(3);
    expect(onComprado).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'pocion' }));
    expect(campo).toHaveValue(null);
    expect(campo).toHaveFocus();
  });

  test('no compra más pociones de las que se pueden pagar', async () => {
    const usuario = userEvent.setup();
    const onComprado = vi.fn();
    conMonedero(<Monedero onComprado={onComprado} />);

    await usuario.type(screen.getByLabelText(/Pociones de vida/), '50');
    await usuario.click(screen.getByRole('button', { name: 'Comprar' }));

    expect(screen.getByText(/monedas de oro/)).toHaveTextContent('🪙 0 monedas');
    expect(onComprado).toHaveBeenCalledTimes(10);
  });
});

describe('Tienda', () => {
  test('al comprar, el artículo queda comprado y no se puede volver a comprar', async () => {
    const usuario = userEvent.setup();
    conMonedero(<Tienda onComprado={vi.fn()} />);
    const boton = screen.getByRole('button', { name: 'Comprar Escudo de hierro' });

    expect(boton).toHaveTextContent('Comprar');
    await usuario.click(boton);
    expect(boton).toHaveTextContent('Comprado');
    expect(boton).toBeDisabled();
  });

  test('cada compra se entrega con onComprado (para meterla en la mochila)', async () => {
    const usuario = userEvent.setup();
    const onComprado = vi.fn();
    conMonedero(<Tienda onComprado={onComprado} />);

    await usuario.click(screen.getByRole('button', { name: 'Comprar Arco de caza' }));
    expect(onComprado).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ nombre: 'Arco de caza' }),
    );
  });

  test('no deja comprar lo que no se puede pagar', async () => {
    const usuario = userEvent.setup();
    conMonedero(<Tienda onComprado={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Comprar Capa de invisibilidad' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Comprar Arco de caza' })).toBeEnabled();

    await usuario.click(screen.getByRole('button', { name: 'Comprar Escudo de hierro' }));
    expect(screen.getByRole('button', { name: 'Comprar Arco de caza' })).toBeDisabled();
  });
});
