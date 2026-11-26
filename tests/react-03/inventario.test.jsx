// Tests de la tarea react-03 (Listas y subir el estado).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import Inventario from '../../src/componentes/Inventario';
import Mochila from '../../src/componentes/Mochila';
import ObjetoItem from '../../src/componentes/ObjetoItem';

const espada = { id: 'a', nombre: 'Espada', icono: '🗡️', tipo: 'arma', rareza: 'comun', valor: 15 };
const hacha = { id: 'b', nombre: 'Hacha', icono: '🪓', tipo: 'arma', rareza: 'rara', valor: 60 };
const pocion = {
  id: 'c',
  nombre: 'Poción',
  icono: '🧪',
  tipo: 'pocion',
  rareza: 'comun',
  valor: 10,
};
const amuleto = {
  id: 'd',
  nombre: 'Amuleto',
  icono: '💎',
  tipo: 'tesoro',
  rareza: 'epica',
  valor: 120,
};

const espadaCorta = {
  id: 'i1',
  nombre: 'Espada corta',
  icono: '🗡️',
  tipo: 'arma',
  rareza: 'comun',
  valor: 15,
};
const escudo = {
  id: 'i2',
  nombre: 'Escudo de roble',
  icono: '🛡️',
  tipo: 'armadura',
  rareza: 'comun',
  valor: 20,
};

/** Hace de «padre» de la mochila, como la partida: guarda la lista y la cambia cuando Mochila le avisa. */
function ConPadre() {
  const [objetos, setObjetos] = useState([espadaCorta, escudo]);
  return <Mochila objetos={objetos} onCambiarObjetos={setObjetos} onVendido={() => {}} />;
}

const lista = () => screen.getByRole('list', { name: 'Objetos de la mochila' });
const nombresEnLista = () =>
  within(lista())
    .queryAllByRole('listitem')
    .map((li) => li.querySelector('.objeto__nombre')?.textContent);

describe('ObjetoItem', () => {
  test('al pulsar vender llama a onVender con el id del objeto', async () => {
    const usuario = userEvent.setup();
    const onVender = vi.fn();
    render(
      <ul>
        <ObjetoItem objeto={hacha} onVender={onVender} />
      </ul>,
    );
    expect(onVender).not.toHaveBeenCalled();

    await usuario.click(screen.getByRole('button', { name: 'Vender Hacha' }));
    expect(onVender).toHaveBeenCalledExactlyOnceWith('b');
  });
});

describe('Inventario', () => {
  test('muestra un elemento por cada objeto', () => {
    render(<Inventario objetos={[espada, pocion, amuleto]} onVender={vi.fn()} />);
    expect(within(lista()).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Espada')).toBeInTheDocument();
    expect(screen.getByText('Amuleto')).toBeInTheDocument();
  });

  test('ordena los objetos por valor, de mayor a menor', () => {
    render(<Inventario objetos={[espada, pocion, amuleto, hacha]} onVender={vi.fn()} />);
    expect(nombresEnLista()).toEqual(['Amuleto', 'Hacha', 'Espada', 'Poción']);
  });

  test('ordenar no modifica el array que recibe', () => {
    const objetos = [espada, pocion, amuleto];
    render(<Inventario objetos={objetos} onVender={vi.fn()} />);
    expect(nombresEnLista()).toEqual(['Amuleto', 'Espada', 'Poción']);
    expect(objetos.map((o) => o.nombre)).toEqual(['Espada', 'Poción', 'Amuleto']);
  });

  test('el filtro muestra solo los objetos de ese tipo', async () => {
    const usuario = userEvent.setup();
    render(<Inventario objetos={[espada, pocion, amuleto, hacha]} onVender={vi.fn()} />);

    await usuario.click(screen.getByRole('button', { name: 'Armas' }));
    expect(nombresEnLista()).toEqual(['Hacha', 'Espada']);

    await usuario.click(screen.getByRole('button', { name: 'Todo' }));
    expect(nombresEnLista()).toHaveLength(4);
  });

  test('avisa cuando la mochila está vacía', () => {
    render(<Inventario objetos={[]} onVender={vi.fn()} />);
    expect(screen.getByText('La mochila está vacía.')).toBeInTheDocument();
  });

  test('avisa cuando el filtro no deja ningún objeto', async () => {
    const usuario = userEvent.setup();
    render(<Inventario objetos={[espada, pocion]} onVender={vi.fn()} />);
    expect(screen.queryByText(/No tienes objetos/)).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Tesoros' }));
    expect(screen.getByText('No tienes objetos de este tipo.')).toBeInTheDocument();
  });

  test('no muestra avisos cuando hay objetos', () => {
    render(<Inventario objetos={[espada]} onVender={vi.fn()} />);
    expect(screen.queryByText(/vacía/)).not.toBeInTheDocument();
    expect(screen.getByText('Espada')).toBeInTheDocument();
  });
});

describe('Mochila', () => {
  test('no cambia la lista que recibe: le pasa al padre una nueva', async () => {
    const usuario = userEvent.setup();
    const objetos = [espadaCorta, escudo];
    const onCambiarObjetos = vi.fn();
    render(<Mochila objetos={objetos} onCambiarObjetos={onCambiarObjetos} onVendido={vi.fn()} />);

    await usuario.click(screen.getByRole('button', { name: 'Vender Espada corta' }));
    expect(onCambiarObjetos).toHaveBeenCalledExactlyOnceWith([escudo]);
    expect(objetos).toEqual([espadaCorta, escudo]);
  });

  test('abrir el cofre añade el objeto al final de la mochila', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre />);
    const antes = within(lista()).getAllByRole('listitem').length;

    await usuario.click(screen.getByRole('button', { name: /Abrir cofre/ }));
    expect(within(lista()).getAllByRole('listitem')).toHaveLength(antes + 1);
    expect(screen.getByText('Amuleto de rubí')).toBeInTheDocument();
  });

  test('vender avisa al padre con el objeto vendido (onVendido), para cobrarlo', async () => {
    const usuario = userEvent.setup();
    const onVendido = vi.fn();
    render(
      <Mochila objetos={[espadaCorta, escudo]} onCambiarObjetos={vi.fn()} onVendido={onVendido} />,
    );

    await usuario.click(screen.getByRole('button', { name: 'Vender Escudo de roble' }));
    expect(onVendido).toHaveBeenCalledExactlyOnceWith(escudo);
  });

  test('vender un objeto lo quita de la mochila', async () => {
    const usuario = userEvent.setup();
    render(<ConPadre />);

    await usuario.click(screen.getByRole('button', { name: 'Vender Espada corta' }));
    expect(screen.queryByText('Espada corta')).not.toBeInTheDocument();
    expect(screen.getByText('Escudo de roble')).toBeInTheDocument();
  });

  test('si el cofre da dos veces el mismo objeto, vender uno solo quita ese', async () => {
    const usuario = userEvent.setup();
    const aviso = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ConPadre />);

    // El cofre da 5 objetos distintos y luego vuelve a empezar: el 6.º es otra vez el amuleto
    for (let i = 0; i < 6; i++) {
      await usuario.click(screen.getByRole('button', { name: /Abrir cofre/ }));
    }
    expect(screen.getAllByText('Amuleto de rubí')).toHaveLength(2);

    await usuario.click(screen.getAllByRole('button', { name: 'Vender Amuleto de rubí' })[0]);
    expect(screen.getAllByText('Amuleto de rubí')).toHaveLength(1);
    aviso.mockRestore();
  });
});
