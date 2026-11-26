import { Link } from 'react-router';

// La página de cualquier dirección que no existe. Ya está hecha.
export default function NoEncontrada() {
  return (
    <main className="pagina">
      <section className="panel">
        <h2 className="panel__titulo">¿Dónde estás?</h2>
        <div className="perdido">
          <p className="perdido__icono" aria-hidden="true">
            🕳️
          </p>
          <p>Te has perdido en la mazmorra: aquí no hay nada.</p>
          <Link to="/" className="enlace">
            ← Volver a la entrada
          </Link>
        </div>
      </section>
    </main>
  );
}
