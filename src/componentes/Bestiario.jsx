import { useEffect, useState } from 'react';
import { URL_BESTIARIO } from '../logica/api';

// Lista de monstruos que se carga de la API. Al pulsar «Luchar», se elige ese monstruo para el combate.
export default function Bestiario({ onElegir }) {
  // Ya hecho: los tres estados de cualquier petición (tema 7, "El patrón loading / error / data").
  // Fíjate en que `cargando` empieza en true: al aparecer el componente, la petición ya está en marcha.
  const [monstruos, setMonstruos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // TODO 5.1: Al montar el componente (solo una vez), pide los monstruos a URL_BESTIARIO con fetch:
  //   - si la respuesta no es correcta (res.ok), lanza un Error con el texto `HTTP ${res.status}`,
  //   - guarda los monstruos recibidos en el estado,
  //   - si algo falla, guarda el error (salvo que sea un AbortError),
  //   - al terminar, `cargando` pasa a false (salvo que la petición se haya cancelado),
  //   - y devuelve una limpieza que cancele la petición con un AbortController.
  // Es exactamente el ejemplo del apartado "El patrón loading / error / data" del tema 7: léelo
  // con calma y entiende cada línea antes de escribirla.

  // TODO 5.2: Mientras carga, devuelve <p className="bestiario__estado">Cargando bestiario…</p>.
  // Si hay error, devuelve <p className="bestiario__estado bestiario__estado--error" role="alert">
  // con el texto "No se ha podido cargar el bestiario: " seguido de error.message.
  // Pista: early return (tema 3, "Renderizado condicional").

  return (
    <ul className="bestiario" aria-label="Bestiario">
      {monstruos.map((monstruo) => (
        <li key={monstruo.id} className="bestiario__monstruo">
          <span className="bestiario__avatar" aria-hidden="true">
            {monstruo.avatar}
          </span>
          <div className="bestiario__info">
            <strong>{monstruo.nombre}</strong>
            <small>{monstruo.descripcion}</small>
            <small>
              ❤️ {monstruo.vidaMax} · ⚔️ {monstruo.ataque} · 🛡️ {monstruo.defensa}
            </small>
          </div>
          <button
            type="button"
            className="bestiario__luchar"
            aria-label={`Luchar contra ${monstruo.nombre}`}
            onClick={() => onElegir(monstruo)}
          >
            Luchar
          </button>
        </li>
      ))}
    </ul>
  );
}
