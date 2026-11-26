import Inscripcion from '../componentes/Inscripcion';
import Rumores from '../componentes/Rumores';
import { usePartida } from '../partida/usePartida';

// La página del gremio. Ya está hecha: el trabajo está en sus componentes (react-08).
export default function PaginaGremio() {
  const { heroeEquipado } = usePartida();

  return (
    <main className="app__contenido">
      <section className="panel">
        <h2 className="panel__titulo">Misiones</h2>
        <Inscripcion heroe={heroeEquipado} />
      </section>
      <section className="panel">
        <h2 className="panel__titulo">Tablón de rumores</h2>
        <Rumores />
      </section>
    </main>
  );
}
