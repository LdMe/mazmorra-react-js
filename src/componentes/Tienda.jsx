import { articulosTienda } from '../datos/tienda';
import { efectoDe } from '../logica/objetos';
import { useMonedero } from '../hooks/useMonedero';
import Pendiente from './Pendiente';

// La tienda: cada artículo se puede comprar una vez, si llega el oro. (Las pociones se compran en el monedero.)
export default function Tienda({ onComprado }) {
  // TODO 7.7: Con useMonedero, saca oro, compras y comprar. Para cada artículo:
  //   - si ya está en compras (busca uno con el mismo id), el botón dice "Comprado" y está desactivado,
  //   - si no, dice "Comprar" y, si el oro no llega para su valor, también está desactivado,
  //   - al pulsarlo, llama a comprar(articulo) (eso paga) y a onComprado(articulo) (eso lo mete
  //     en la mochila).
  // El botón tiene que llevar aria-label={`Comprar ${articulo.nombre}`} y la clase "tienda__comprar".
  // Fíjate: el oro no le llega a Tienda por props, sino por el contexto, y cuando compra,
  // el Monedero se entera aunque no tengan ningún padre en común que les pase nada.

  return (
    <ul className="tienda">
      {articulosTienda.map((articulo) => {
        return (
          <li key={articulo.id} className={`objeto objeto--${articulo.rareza}`}>
            <span className="objeto__icono" aria-hidden="true">
              {articulo.icono}
            </span>
            <span className="objeto__texto">
              <span className="objeto__nombre">{articulo.nombre}</span>
              <span className="objeto__detalle">
                {efectoDe(articulo)} · <span className="objeto__valor">{articulo.valor} 🪙</span>
              </span>
            </span>
            <Pendiente todo="7.7" />
          </li>
        );
      })}
    </ul>
  );
}
