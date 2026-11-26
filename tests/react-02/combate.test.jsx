// Tests de la tarea react-02 (Eventos y estado).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import BotonAccion from '../../src/componentes/BotonAccion';
import Combate from '../../src/componentes/Combate';

// Con estos datos, Aria hace 12 - 2 = 10 de daño y el Goblin le hace 9 - 5 = 4.
const aria = {
  nombre: 'Aria',
  clase: 'Guerrera',
  nivel: 3,
  avatar: '🛡️',
  vida: 100,
  vidaMax: 100,
  ataque: 12,
  defensa: 5,
};

const goblin = { nombre: 'Goblin', avatar: '👺', vidaMax: 30, ataque: 9, defensa: 2 };

const vidaDe = (nombre) =>
  Number(screen.getByRole('meter', { name: `Vida de ${nombre}` }).getAttribute('aria-valuenow'));

const boton = (nombre) => screen.getByRole('button', { name: nombre });

/**
 * Hace de «padre» del combate, como src/App: guarda la vida del héroe y las pociones en su estado,
 * se las pasa a Combate y las cambia cuando Combate le avisa.
 */
function ConPadre({ heroe, monstruo, onVictoria = () => {} }) {
  const [vida, setVida] = useState(heroe.vida);
  const [pociones, setPociones] = useState(3);
  return (
    <Combate
      heroe={{ ...heroe, vida }}
      monstruo={monstruo}
      pociones={pociones}
      onCambiarVida={setVida}
      onBeberPocion={() => setPociones((quedan) => quedan - 1)}
      onVictoria={onVictoria}
    />
  );
}

/** Las props de Combate sin padre: nada cambia aunque Combate avise. */
const sinPadre = {
  pociones: 3,
  onCambiarVida: vi.fn(),
  onBeberPocion: vi.fn(),
  onVictoria: vi.fn(),
};

describe('BotonAccion', () => {
  test('llama a onAccion al pulsarlo, y no antes', async () => {
    const usuario = userEvent.setup();
    const onAccion = vi.fn();
    render(<BotonAccion texto="Atacar" icono="⚔️" onAccion={onAccion} />);
    expect(onAccion).not.toHaveBeenCalled();

    await usuario.click(screen.getByRole('button', { name: /Atacar/ }));
    expect(onAccion).toHaveBeenCalledOnce();
  });

  test('se desactiva con la prop deshabilitado', async () => {
    const usuario = userEvent.setup();
    const onAccion = vi.fn();
    render(<BotonAccion texto="Atacar" icono="⚔️" onAccion={onAccion} deshabilitado />);

    const elBoton = screen.getByRole('button', { name: /Atacar/ });
    expect(elBoton).toBeDisabled();
    await usuario.click(elBoton);
    expect(onAccion).not.toHaveBeenCalled();
  });
});

describe('Combate', () => {
  test('la vida del héroe la guarda el padre: Combate la cambia con onCambiarVida', async () => {
    const usuario = userEvent.setup();
    const onCambiarVida = vi.fn();
    render(
      <Combate
        {...sinPadre}
        heroe={{ ...aria, vida: 50 }}
        monstruo={goblin}
        onCambiarVida={onCambiarVida}
      />,
    );
    expect(vidaDe('Aria')).toBe(50);

    await usuario.click(boton(/Atacar/));
    expect(onCambiarVida).toHaveBeenCalledExactlyOnceWith(46);
    // El padre de este test no actualiza nada: si Combate no guarda la vida por su cuenta, sigue en 50
    expect(vidaDe('Aria')).toBe(50);
  });

  test('si el héroe llega sin vida, el combate ya está perdido', () => {
    render(<Combate {...sinPadre} heroe={{ ...aria, vida: 0 }} monstruo={goblin} />);
    expect(screen.getByRole('status')).toHaveTextContent('Derrota');
    expect(boton(/Atacar/)).toBeDisabled();
  });

  test('al atacar, el monstruo pierde vida', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Atacar/));
    expect(vidaDe('Goblin')).toBe(20);
  });

  test('la vida del monstruo no baja de 0', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, vidaMax: 25 }} />);

    await usuario.click(boton(/Atacar/)); // 15
    await usuario.click(boton(/Atacar/)); // 5
    await usuario.click(boton(/Atacar/)); // -5 → 0
    expect(vidaDe('Goblin')).toBe(0);
  });

  test('si el monstruo sigue vivo, contraataca', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Atacar/));
    expect(vidaDe('Aria')).toBe(96);
  });

  test('un monstruo derrotado no contraataca', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, vidaMax: 10 }} />);

    await usuario.click(boton(/Atacar/));
    expect(vidaDe('Goblin')).toBe(0);
    expect(vidaDe('Aria')).toBe(100);
  });

  test('los ataques se anotan en el registro', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Atacar/));
    const registro = screen.getByRole('list', { name: 'Registro de combate' });
    const lineas = within(registro).getAllByRole('listitem');
    expect(lineas).toHaveLength(2);
    expect(lineas[0]).toHaveTextContent('Aria ataca a Goblin: -10 PV');
    expect(lineas[1]).toHaveTextContent('Goblin ataca a Aria: -4 PV');
  });

  test('beber una poción recupera 30 PV', async () => {
    const usuario = userEvent.setup();
    // Un monstruo muy fuerte: cada contraataque quita 45 - 5 = 40 PV
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, ataque: 45 }} />);

    await usuario.click(boton(/Atacar/)); // Aria: 60
    await usuario.click(boton(/Poción/));
    expect(vidaDe('Aria')).toBe(90);
  });

  test('una poción no sube la vida por encima del máximo', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Atacar/));
    expect(vidaDe('Aria')).toBe(96);
    await usuario.click(boton(/Poción/));
    expect(vidaDe('Aria')).toBe(100);
  });

  test('cada poción gasta una de las que quedan', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Poción/));
    expect(boton(/Poción \(2\)/)).toBeInTheDocument();
  });

  test('el botón de poción se desactiva cuando no quedan', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={goblin} />);

    await usuario.click(boton(/Poción/));
    await usuario.click(boton(/Poción/));
    await usuario.click(boton(/Poción/));
    expect(boton(/Poción \(0\)/)).toBeDisabled();
  });

  test('al derrotar al monstruo avisa al padre una sola vez (onVictoria)', async () => {
    const usuario = userEvent.setup();
    const onVictoria = vi.fn();
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, vidaMax: 15 }} onVictoria={onVictoria} />);

    await usuario.click(boton(/Atacar/)); // 5
    expect(onVictoria).not.toHaveBeenCalled();
    await usuario.click(boton(/Atacar/)); // 0
    expect(onVictoria).toHaveBeenCalledOnce();
  });

  test('beber una poción avisa al padre para que la quite de la mochila (onBeberPocion)', async () => {
    const usuario = userEvent.setup();
    const onBeberPocion = vi.fn();
    render(
      <Combate
        {...sinPadre}
        heroe={{ ...aria, vida: 50 }}
        monstruo={goblin}
        onBeberPocion={onBeberPocion}
      />,
    );

    await usuario.click(boton(/Poción/));
    expect(onBeberPocion).toHaveBeenCalledOnce();
    expect(sinPadre.onCambiarVida).toHaveBeenLastCalledWith(80);
  });

  test('sin pociones en la mochila no se puede beber', () => {
    render(<Combate {...sinPadre} heroe={aria} monstruo={goblin} pociones={0} />);
    expect(boton(/Poción \(0\)/)).toBeDisabled();
  });

  test('al derrotar al monstruo se muestra «¡Victoria!» y se desactivan las acciones', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, vidaMax: 10 }} />);

    await usuario.click(boton(/Atacar/));
    expect(screen.getByRole('status')).toHaveTextContent('¡Victoria!');
    expect(boton(/Atacar/)).toBeDisabled();
    expect(boton(/Poción/)).toBeDisabled();
  });

  test('si el héroe cae se muestra «Derrota»', async () => {
    const usuario = userEvent.setup();
    // Un contraataque quita 200 - 5 = 195 PV: Aria cae al primer golpe
    render(<ConPadre heroe={aria} monstruo={{ ...goblin, ataque: 200 }} />);

    await usuario.click(boton(/Atacar/));
    expect(vidaDe('Aria')).toBe(0);
    expect(screen.getByRole('status')).toHaveTextContent('Derrota');
  });
});
