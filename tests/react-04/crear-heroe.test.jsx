// Tests de la tarea react-04 (Formularios).
// Los nombres «describe > test» son los que IkasBot compara: no los cambies.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import CrearHeroe from '../../src/componentes/CrearHeroe';

const vistaPrevia = () => screen.getByText(/Vista previa/);
const puntos = () => screen.getByText(/Puntos por repartir/);
const nombre = () => screen.getByLabelText('Nombre');
const crear = () => screen.getByRole('button', { name: /Crear héroe/ });

async function rellenar(usuario, datos) {
  if (datos.nombre) await usuario.type(nombre(), datos.nombre);
  if (datos.ataque) await usuario.type(screen.getByLabelText('Ataque'), datos.ataque);
  if (datos.defensa) await usuario.type(screen.getByLabelText('Defensa'), datos.defensa);
}

describe('CrearHeroe', () => {
  test('al escribir el nombre se actualiza la vista previa', async () => {
    const usuario = userEvent.setup();
    render(<CrearHeroe onCrear={vi.fn()} />);

    await usuario.type(nombre(), 'Lyra');
    expect(nombre()).toHaveValue('Lyra');
    expect(vistaPrevia()).toHaveTextContent('Lyra');
  });

  test('al elegir clase y avatar se actualiza la vista previa', async () => {
    const usuario = userEvent.setup();
    render(<CrearHeroe onCrear={vi.fn()} />);

    await usuario.selectOptions(screen.getByLabelText('Clase'), 'Mago');
    await usuario.click(screen.getByRole('radio', { name: '🧝' }));
    expect(vistaPrevia()).toHaveTextContent('Mago');
    expect(vistaPrevia()).toHaveTextContent('🧝');
    expect(screen.getByRole('radio', { name: '🧝' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '🛡️' })).not.toBeChecked();
  });

  test('los puntos por repartir se recalculan al escribir ataque y defensa', async () => {
    const usuario = userEvent.setup();
    render(<CrearHeroe onCrear={vi.fn()} />);
    expect(puntos()).toHaveTextContent('20');

    await rellenar(usuario, { ataque: '12' });
    expect(puntos()).toHaveTextContent('8');
    await rellenar(usuario, { defensa: '8' });
    expect(puntos()).toHaveTextContent('0');
  });

  test('sin nombre no se crea el héroe y se avisa', async () => {
    const usuario = userEvent.setup();
    const onCrear = vi.fn();
    render(<CrearHeroe onCrear={onCrear} />);

    await rellenar(usuario, { ataque: '10', defensa: '10' });
    await usuario.click(crear());
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(nombre()).toHaveAttribute('aria-invalid', 'true');
    expect(onCrear).not.toHaveBeenCalled();
  });

  test('un nombre de menos de 3 letras no es válido', async () => {
    const usuario = userEvent.setup();
    const onCrear = vi.fn();
    render(<CrearHeroe onCrear={onCrear} />);

    await rellenar(usuario, { nombre: 'Al', ataque: '10', defensa: '10' });
    await usuario.click(crear());
    expect(screen.getByText('El nombre debe tener entre 3 y 12 letras')).toBeInTheDocument();
    expect(onCrear).not.toHaveBeenCalled();
  });

  test('hay que repartir todos los puntos', async () => {
    const usuario = userEvent.setup();
    const onCrear = vi.fn();
    render(<CrearHeroe onCrear={onCrear} />);

    await rellenar(usuario, { nombre: 'Lyra', ataque: '5', defensa: '5' });
    await usuario.click(crear());
    expect(screen.getByText('Te quedan 10 puntos por repartir')).toBeInTheDocument();
    expect(onCrear).not.toHaveBeenCalled();
  });

  test('ataque y defensa deben ser al menos 1', async () => {
    const usuario = userEvent.setup();
    const onCrear = vi.fn();
    render(<CrearHeroe onCrear={onCrear} />);

    await rellenar(usuario, { nombre: 'Lyra', ataque: '20', defensa: '0' });
    await usuario.click(crear());
    expect(screen.getByText('Ataque y defensa deben ser al menos 1')).toBeInTheDocument();
    expect(onCrear).not.toHaveBeenCalled();
  });

  test('con datos válidos llama a onCrear con el héroe', async () => {
    const usuario = userEvent.setup();
    const onCrear = vi.fn();
    render(<CrearHeroe onCrear={onCrear} />);

    await rellenar(usuario, { nombre: '  Lyra ', ataque: '12', defensa: '8' });
    await usuario.selectOptions(screen.getByLabelText('Clase'), 'Mago');
    await usuario.click(screen.getByRole('radio', { name: '🧝' }));
    await usuario.click(crear());

    expect(onCrear).toHaveBeenCalledExactlyOnceWith({
      nombre: 'Lyra',
      clase: 'Mago',
      nivel: 1,
      avatar: '🧝',
      vida: 70,
      vidaMax: 70,
      ataque: 12,
      defensa: 8,
    });
  });

  test('al crear el héroe se vacía el formulario y desaparecen los errores', async () => {
    const usuario = userEvent.setup();
    render(<CrearHeroe onCrear={vi.fn()} />);

    await usuario.click(crear());
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();

    await rellenar(usuario, { nombre: 'Lyra', ataque: '10', defensa: '10' });
    await usuario.click(crear());
    expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Lyra se une a la aventura');
    expect(nombre()).toHaveValue('');
    expect(puntos()).toHaveTextContent('20');
  });
});
