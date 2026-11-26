// Tests de la tarea react-08 (Actions de React 19).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import BotonEnviar from '../../src/componentes/BotonEnviar';
import Inscripcion from '../../src/componentes/Inscripcion';
import Rumores from '../../src/componentes/Rumores';

// El «servidor» del gremio (src/logica/gremio) se sustituye por funciones falsas: cada test decide
// qué responden y cuándo. Lo demás del archivo (el tablón de misiones, los rumores iniciales...) se queda como está.
const { inscribirEnMision, publicarRumor } = vi.hoisted(() => ({
  inscribirEnMision: vi.fn(),
  publicarRumor: vi.fn(),
}));
vi.mock('../../src/logica/gremio', async (original) => ({
  ...(await original()),
  inscribirEnMision,
  publicarRumor,
}));

/** Una promesa que no se resuelve hasta que el test llama a `resolver`. */
function promesaEnEspera() {
  let resolver;
  const promesa = new Promise((r) => {
    resolver = r;
  });
  return { promesa, resolver };
}

beforeEach(() => {
  inscribirEnMision.mockReset();
  publicarRumor.mockReset();
});

const aria = {
  nombre: 'Aria',
  clase: 'Guerrera',
  nivel: 3,
  avatar: '🛡️',
  vida: 100,
  vidaMax: 100,
  ataque: 14,
  defensa: 7,
};

describe('Inscripción (useActionState)', () => {
  test('sin elegir misión muestra el error y no llama al gremio', async () => {
    const usuario = userEvent.setup();
    render(<Inscripcion heroe={aria} />);

    await usuario.click(screen.getByRole('button', { name: 'Apuntarme' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Elige una misión.');
    expect(inscribirEnMision).not.toHaveBeenCalled();
  });

  test('envía la misión y el héroe al gremio y muestra su respuesta', async () => {
    const usuario = userEvent.setup();
    inscribirEnMision.mockResolvedValue('¡Hecho, Aria!');
    render(<Inscripcion heroe={aria} />);

    await usuario.selectOptions(screen.getByLabelText(/Misión para Aria/), 'Escoltar la caravana');
    await usuario.click(screen.getByRole('button', { name: 'Apuntarme' }));

    expect(await screen.findByRole('status')).toHaveTextContent('¡Hecho, Aria!');
    expect(inscribirEnMision).toHaveBeenCalledExactlyOnceWith('Escoltar la caravana', {
      nombre: 'Aria',
      ataque: 14,
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('si el gremio responde con un error, lo muestra', async () => {
    const usuario = userEvent.setup();
    inscribirEnMision.mockRejectedValue(
      new Error('El gremio no te deja ir: consigue un arma mejor.'),
    );
    render(<Inscripcion heroe={aria} />);

    await usuario.selectOptions(screen.getByLabelText(/Misión para Aria/), 'Matar al dragón');
    await usuario.click(screen.getByRole('button', { name: 'Apuntarme' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El gremio no te deja ir: consigue un arma mejor.',
    );
  });
});

describe('BotonEnviar (useFormStatus)', () => {
  test('mientras se envía el formulario dice «Enviando…» y está desactivado', async () => {
    const usuario = userEvent.setup();
    const { promesa, resolver } = promesaEnEspera();
    render(
      <form action={() => promesa}>
        <BotonEnviar>Enviar carta</BotonEnviar>
      </form>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('Enviar carta');
    await usuario.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Enviando…');
    expect(screen.getByRole('button')).toBeDisabled();

    resolver();
    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Enviar carta'));
    expect(screen.getByRole('button')).toBeEnabled();
  });
});

describe('Rumores (useOptimistic)', () => {
  test('publica el rumor en el gremio y lo añade al tablón', async () => {
    const usuario = userEvent.setup();
    publicarRumor.mockResolvedValue({ id: 'r-9', texto: 'Hay un cofre bajo el puente' });
    render(<Rumores />);

    await usuario.type(screen.getByLabelText('Nuevo rumor'), '  Hay un cofre bajo el puente ');
    await usuario.click(screen.getByRole('button', { name: 'Publicar' }));

    await waitFor(() =>
      expect(screen.getByText('Hay un cofre bajo el puente')).not.toHaveClass('rumor--enviando'),
    );
    expect(publicarRumor).toHaveBeenCalledExactlyOnceWith('Hay un cofre bajo el puente');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('el rumor sale al momento, marcado «enviando…», antes de que responda el gremio', async () => {
    const usuario = userEvent.setup();
    const { promesa, resolver } = promesaEnEspera();
    publicarRumor.mockReturnValue(promesa);
    render(<Rumores />);

    await usuario.type(screen.getByLabelText('Nuevo rumor'), 'El golem odia la lluvia');
    await usuario.click(screen.getByRole('button', { name: 'Publicar' }));

    const provisional = await screen.findByText('El golem odia la lluvia');
    expect(provisional).toHaveClass('rumor--enviando');
    expect(provisional).toHaveTextContent('(enviando…)');

    resolver({ id: 'r-10', texto: 'El golem odia la lluvia' });
    await waitFor(() => expect(screen.queryByText(/enviando…/)).not.toBeInTheDocument());
    expect(screen.getAllByText('El golem odia la lluvia')).toHaveLength(1);
  });

  test('no publica rumores vacíos', async () => {
    const usuario = userEvent.setup();
    publicarRumor.mockResolvedValue({ id: 'r-11', texto: 'Algo' });
    render(<Rumores />);

    await usuario.type(screen.getByLabelText('Nuevo rumor'), '   ');
    await usuario.click(screen.getByRole('button', { name: 'Publicar' }));
    await usuario.type(screen.getByLabelText('Nuevo rumor'), 'Algo');
    await usuario.click(screen.getByRole('button', { name: 'Publicar' }));

    await waitFor(() => expect(publicarRumor).toHaveBeenCalledOnce());
    expect(publicarRumor).toHaveBeenCalledWith('Algo');
  });
});
