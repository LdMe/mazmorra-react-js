// Tests de la tarea react-05 (Efectos y peticiones a APIs).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Bestiario from '../../src/componentes/Bestiario';
import Diario from '../../src/componentes/Diario';
import Taberna from '../../src/componentes/Taberna';

const monstruosApi = [
  {
    id: 1,
    nombre: 'Goblin',
    avatar: '👺',
    vidaMax: 40,
    ataque: 9,
    defensa: 2,
    descripcion: 'Ruidoso',
  },
  {
    id: 2,
    nombre: 'Slime',
    avatar: '🟢',
    vidaMax: 30,
    ataque: 6,
    defensa: 1,
    descripcion: 'Pegajoso',
  },
];

/** Sustituye fetch por una versión falsa que responde con `cuerpo` y el código `status`. */
function simularFetch(cuerpo, status = 200) {
  const fetchFalso = vi.fn((_url, _opciones) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(cuerpo),
    }),
  );
  vi.stubGlobal('fetch', fetchFalso);
  return fetchFalso;
}

describe('Bestiario', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('pide los monstruos a la API al aparecer', async () => {
    const fetchFalso = simularFetch(monstruosApi);
    render(<Bestiario onElegir={vi.fn()} />);

    expect(await screen.findByText('Goblin')).toBeInTheDocument();
    expect(fetchFalso).toHaveBeenCalledOnce();
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/monstruos.json');
  });

  test('muestra un aviso mientras carga', async () => {
    simularFetch(monstruosApi);
    render(<Bestiario onElegir={vi.fn()} />);

    expect(screen.getByText('Cargando bestiario…')).toBeInTheDocument();
    expect(await screen.findByText('Slime')).toBeInTheDocument();
    expect(screen.queryByText('Cargando bestiario…')).not.toBeInTheDocument();
  });

  test('muestra el error si la API responde con un error HTTP', async () => {
    simularFetch({ error: 'Algo ha ido mal' }, 500);
    render(<Bestiario onElegir={vi.fn()} />);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('No se ha podido cargar el bestiario: HTTP 500');
    expect(screen.queryByText('Cargando bestiario…')).not.toBeInTheDocument();
  });

  test('al pulsar «Luchar» elige ese monstruo', async () => {
    const usuario = userEvent.setup();
    simularFetch(monstruosApi);
    const onElegir = vi.fn();
    render(<Bestiario onElegir={onElegir} />);

    await usuario.click(await screen.findByRole('button', { name: 'Luchar contra Slime' }));
    expect(onElegir).toHaveBeenCalledExactlyOnceWith(monstruosApi[1]);
  });

  test('cancela la petición si el componente desaparece', () => {
    const fetchFalso = simularFetch(monstruosApi);
    const { unmount } = render(<Bestiario onElegir={vi.fn()} />);

    const senal = fetchFalso.mock.calls[0]?.[1]?.signal;
    expect(senal).toBeInstanceOf(AbortSignal);
    expect(senal?.aborted).toBe(false);
    unmount();
    expect(senal?.aborted).toBe(true);
  });
});

describe('Taberna', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const contador = () => screen.getByText(/Descansando:/);
  const herida = {
    nombre: 'Aria',
    clase: 'Guerrera',
    nivel: 3,
    avatar: '🛡️',
    vida: 60,
    vidaMax: 100,
    ataque: 12,
    defensa: 5,
  };

  test('mientras descansa, suma un segundo cada segundo', () => {
    render(<Taberna heroe={herida} onCambiarVida={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Descansar/ }));

    act(() => vi.advanceTimersByTime(3000));
    expect(contador()).toHaveTextContent('3 s');
    expect(contador()).toHaveTextContent('+15 PV');
  });

  test('al levantarse deja de contar', () => {
    render(<Taberna heroe={herida} onCambiarVida={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Descansar/ }));
    act(() => vi.advanceTimersByTime(2000));
    expect(contador()).toHaveTextContent('2 s');

    fireEvent.click(screen.getByRole('button', { name: /Levantarse/ }));
    act(() => vi.advanceTimersByTime(5000));
    expect(contador()).toHaveTextContent('2 s');
  });

  test('al levantarse, el héroe recupera la vida descansada', () => {
    const onCambiarVida = vi.fn();
    render(<Taberna heroe={herida} onCambiarVida={onCambiarVida} />);
    fireEvent.click(screen.getByRole('button', { name: /Descansar/ }));
    act(() => vi.advanceTimersByTime(4000));

    fireEvent.click(screen.getByRole('button', { name: /Levantarse/ }));
    expect(onCambiarVida).toHaveBeenCalledExactlyOnceWith(80);
  });

  test('no deja temporizadores activos al desaparecer', () => {
    const { unmount } = render(<Taberna heroe={herida} onCambiarVida={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Descansar/ }));
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('Diario', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('recupera lo que había guardado en localStorage', () => {
    localStorage.setItem('mazmorra-diario', 'Día 1: encontré una espada.');
    render(<Diario />);
    expect(screen.getByLabelText('Diario del aventurero')).toHaveValue(
      'Día 1: encontré una espada.',
    );
  });

  test('guarda en localStorage lo que se escribe', async () => {
    const usuario = userEvent.setup();
    render(<Diario />);

    await usuario.type(screen.getByLabelText('Diario del aventurero'), 'Hola');
    expect(localStorage.getItem('mazmorra-diario')).toBe('Hola');
  });

  test('solo lee localStorage al montar, no en cada render', async () => {
    const usuario = userEvent.setup();
    localStorage.setItem('mazmorra-diario', 'Hola');
    const lectura = vi.spyOn(Storage.prototype, 'getItem');
    render(<Diario />);
    await usuario.type(screen.getByLabelText('Diario del aventurero'), ' mundo');

    expect(screen.getByLabelText('Diario del aventurero')).toHaveValue('Hola mundo');
    expect(lectura).toHaveBeenCalledOnce();
    lectura.mockRestore();
  });
});
