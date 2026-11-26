// Tests de la tarea react-01 (Componentes y props).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import HeroCard from '../../src/componentes/HeroCard';
import Panel from '../../src/componentes/Panel';
import Stat from '../../src/componentes/Stat';

const aria = {
  nombre: 'Aria',
  clase: 'Guerrera',
  nivel: 3,
  avatar: '🛡️',
  vida: 70,
  vidaMax: 100,
  ataque: 12,
  defensa: 5,
};

describe('Stat', () => {
  test('muestra la etiqueta y el valor', () => {
    render(
      <ul>
        <Stat etiqueta="Ataque" valor={12} icono="⚔️" />
      </ul>,
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Ataque');
    expect(item).toHaveTextContent('12');
  });

  test('muestra el icono que recibe', () => {
    render(
      <ul>
        <Stat etiqueta="Ataque" valor={12} icono="⚔️" />
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('⚔️');
  });

  test('usa • como icono si no recibe ninguno', () => {
    render(
      <ul>
        <Stat etiqueta="Suerte" valor={7} />
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('•');
  });
});

describe('Panel', () => {
  test('muestra el título en un encabezado', () => {
    render(
      <Panel titulo="Inventario">
        <p>Una espada</p>
      </Panel>,
    );
    expect(screen.getByRole('heading', { name: 'Inventario' })).toBeInTheDocument();
  });

  test('muestra lo que recibe entre sus etiquetas', () => {
    render(
      <Panel titulo="Inventario">
        <p>Una espada</p>
        <p>Dos pociones</p>
      </Panel>,
    );
    expect(screen.getByText('Una espada')).toBeInTheDocument();
    expect(screen.getByText('Dos pociones')).toBeInTheDocument();
  });
});

describe('HeroCard', () => {
  test('muestra el nombre del héroe en un encabezado', () => {
    render(<HeroCard heroe={aria} />);
    expect(screen.getByRole('heading', { name: 'Aria' })).toBeInTheDocument();
  });

  test('muestra el nivel y la clase', () => {
    render(<HeroCard heroe={aria} />);
    expect(screen.getByText(/Nivel 3/)).toHaveTextContent('Guerrera');
  });

  test('muestra el ataque y la defensa', () => {
    render(<HeroCard heroe={aria} />);
    const stats = screen.getAllByRole('listitem');
    expect(stats).toHaveLength(2);
    expect(stats[0]).toHaveTextContent('Ataque');
    expect(stats[0]).toHaveTextContent('12');
    expect(stats[1]).toHaveTextContent('Defensa');
    expect(stats[1]).toHaveTextContent('5');
  });

  test('muestra la barra de vida si sigue vivo', () => {
    render(<HeroCard heroe={aria} />);
    const barra = screen.getByRole('meter', { name: 'Vida de Aria' });
    expect(barra).toHaveAttribute('aria-valuenow', '70');
    expect(screen.queryByText(/Derrotado/)).not.toBeInTheDocument();
  });

  test('muestra «Derrotado» en lugar de la barra si la vida es 0', () => {
    render(<HeroCard heroe={{ ...aria, vida: 0 }} />);
    expect(screen.getByText(/Derrotado/)).toBeInTheDocument();
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
  });

  test('añade la clase derrotado a la tarjeta si la vida es 0', () => {
    const { container, rerender } = render(<HeroCard heroe={aria} />);
    const tarjeta = container.firstElementChild;
    expect(tarjeta).toHaveClass('heroe-card');
    expect(tarjeta).not.toHaveClass('derrotado');

    rerender(<HeroCard heroe={{ ...aria, vida: 0 }} />);
    expect(container.firstElementChild).toHaveClass('heroe-card', 'derrotado');
  });
});
