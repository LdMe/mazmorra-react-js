import Pendiente from '../componentes/Pendiente';
import { fichas } from '../datos/bestiario';
import { filtrarFichas } from '../logica/bestiario';

// La página del bestiario: todos los monstruos, con un buscador. Cada uno enlaza con su ficha.
export default function PaginaBestiario() {
  // TODO 6.5: Lo que se busca se guarda en la dirección, como parámetro: /bestiario?buscar=go.
  // Así la búsqueda sobrevive a una recarga y se puede compartir el enlace.
  //   - Lee el parámetro "buscar" con useSearchParams (si no está, es '').
  //   - En cambiarBusqueda, guarda el texto nuevo con el setter: { buscar: texto },
  //     o {} si el texto está vacío, para que la dirección quede limpia.
  // (Tema 11, "Query parameters".)
  const buscar = '';

  const cambiarBusqueda = (texto) => {};

  const visibles = filtrarFichas(fichas, buscar);

  return (
    <main className="pagina">
      <section className="panel">
        <h2 className="panel__titulo">Bestiario</h2>
        <input
          type="search"
          className="buscador"
          placeholder="Buscar monstruo…"
          aria-label="Buscar monstruo"
          value={buscar}
          onChange={(e) => cambiarBusqueda(e.target.value)}
        />

        {visibles.length === 0 && <p className="fichas__vacio">Ningún monstruo se llama así.</p>}

        <ul className="fichas">
          {visibles.map((ficha) => (
            <li key={ficha.id}>
              {/* TODO 6.4: Cada monstruo es un <Link> a su ficha, "/bestiario/" seguido de su id,
                   con la clase "ficha-enlace" y el mismo contenido (avatar y nombre).
                   Usa Link y no <a href>: <a> recarga la página entera (tema 11, "Link"). */}
              <span className="ficha-enlace">
                <span aria-hidden="true">{ficha.avatar}</span> {ficha.nombre}{' '}
                <Pendiente todo="6.4" />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
