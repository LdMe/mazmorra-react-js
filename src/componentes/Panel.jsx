import Pendiente from './Pendiente';

// TODO 1.5: Panel es un "envoltorio" reutilizable. Debe devolver:
//   <section className="panel">
//     <h2 className="panel__titulo"> con el título </h2>
//     <div className="panel__contenido"> con lo que venga entre <Panel> y </Panel> </div>
//   </section>
// Pista: lo que va entre las etiquetas de un componente llega en una prop especial
// (tema 3, "La prop especial children").
export default function Panel({ titulo, children }) {
  return (
    <section className="panel">
      <Pendiente todo={`1.5 (panel «${titulo}»)`} />
    </section>
  );
}
