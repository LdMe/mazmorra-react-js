import Monedero from '../componentes/Monedero';
import Tienda from '../componentes/Tienda';
import { usePartida } from '../partida/usePartida';

// La página de la tienda. Ya está hecha: el trabajo está en Monedero y Tienda (react-07).
// Las páginas usan el mismo HTML que <Panel> en lugar del componente, para no depender de react-01.
// Monedero y Tienda no se pasan el oro: los dos usan el monedero compartido (el contexto).
// Lo que se compra (en los dos) va a la mochila de la partida.
export default function PaginaTienda() {
  const { anadirObjeto } = usePartida();

  return (
    <main className="app__contenido">
      <section className="panel">
        <h2 className="panel__titulo">Monedero</h2>
        <Monedero onComprado={anadirObjeto} />
      </section>
      <section className="panel">
        <h2 className="panel__titulo">Tienda</h2>
        <Tienda onComprado={anadirObjeto} />
      </section>
    </main>
  );
}
