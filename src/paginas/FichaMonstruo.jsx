import { Link, useNavigate, useParams } from 'react-router';
import BarraVida from '../componentes/BarraVida';
import { buscarFicha } from '../logica/bestiario';

// La ficha de un monstruo: /bestiario/3 es la del monstruo con id 3.
export default function FichaMonstruo() {
  // TODO 6.6: Saca el id de la dirección con useParams (la ruta es "bestiario/:id").
  // Hasta que lo hagas, la ficha siempre es la del monstruo 1.
  // (Tema 11, "Parámetros dinámicos".)
  const id = '1';

  // TODO 6.7: «Luchar» lleva a la mazmorra con este monstruo como rival: a "/?rival=" seguido de su id.
  // Hay que navegar desde código, al pulsar el botón: usa el hook useNavigate.
  // (La mazmorra, en src/App, ya lee ese parámetro.) (Tema 11, "Navegación programática".)

  const ficha = buscarFicha(id);

  if (!ficha) {
    return (
      <main className="pagina">
        <section className="panel">
          <h2 className="panel__titulo">Bestiario</h2>
          <p className="ficha__error" role="alert">
            No hay ningún monstruo con el número {id}.
          </p>
          <Link to="/bestiario" className="enlace">
            ← Volver al bestiario
          </Link>
        </section>
      </main>
    );
  }

  const luchar = () => {};

  return (
    <main className="pagina">
      <section className="panel">
        <h2 className="panel__titulo">{`Bestiario · nº ${ficha.id}`}</h2>
        <article className="ficha">
          <p className="ficha__avatar" aria-hidden="true">
            {ficha.avatar}
          </p>
          <h2 className="ficha__nombre">{ficha.nombre}</h2>
          <p className="ficha__descripcion">{ficha.descripcion}</p>
          <BarraVida nombre={ficha.nombre} vida={ficha.vidaMax} vidaMax={ficha.vidaMax} />
          <p className="ficha__stats">
            ⚔️ Ataque {ficha.ataque} · 🛡️ Defensa {ficha.defensa}
          </p>
          <div className="ficha__acciones">
            <Link to="/bestiario" className="enlace">
              ← Volver al bestiario
            </Link>
            <button type="button" className="bestiario__luchar" onClick={luchar}>
              ⚔️ Luchar contra {ficha.nombre}
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
