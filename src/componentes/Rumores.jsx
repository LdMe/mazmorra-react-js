import { useOptimistic, useState } from 'react';
import { publicarRumor, rumoresIniciales } from '../logica/gremio';
import BotonEnviar from './BotonEnviar';

// El tablón de rumores del gremio.
export default function Rumores() {
  const [rumores, setRumores] = useState(rumoresIniciales);

  // TODO 8.5: Con useOptimistic, crea a partir de `rumores` la lista que se ve (visibles) y una
  // función para añadir un rumor provisional, que se pinta con { ...nuevo, enviando: true }.
  // Hasta que lo hagas, la lista que se ve es la de verdad.
  // (Tema 9, "useOptimistic: UI optimista".)
  const visibles = rumores;

  // La Action del formulario: recibe los datos del formulario.
  const publicar = async (datos) => {
    // TODO 8.4: Saca el texto del campo "rumor" (sin espacios al principio ni al final). Si está
    // vacío, no hagas nada. Si no, espera a publicarRumor(texto) y añade al final de `rumores` el
    // rumor que te devuelve (con la forma funcional del setter).
    // TODO 8.5 (segunda parte): antes de esperar al gremio, añade el rumor provisional
    // ({ id: crypto.randomUUID(), texto }) para que se vea al momento.
  };
  return (
    <div className="rumores">
      <ul className="rumores__lista">
        {visibles.map((rumor) => (
          <li key={rumor.id} className={rumor.enviando ? 'rumor rumor--enviando' : 'rumor'}>
            {rumor.texto}
            {rumor.enviando && <small> (enviando…)</small>}
          </li>
        ))}
      </ul>

      <form className="rumores__form" action={publicar}>
        <input
          name="rumor"
          aria-label="Nuevo rumor"
          placeholder="¿Qué se cuenta por ahí?"
          autoComplete="off"
        />
        <BotonEnviar>Publicar</BotonEnviar>
      </form>
    </div>
  );
}
