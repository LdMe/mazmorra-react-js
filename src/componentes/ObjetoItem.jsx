import { ETIQUETA_RAREZA, efectoDe, precioDeVenta } from '../logica/objetos';

// Un objeto de la mochila. Es el componente que se repite en la lista del inventario
// (tema 5, "Extraer cada item a su propio componente").
export default function ObjetoItem({ objeto, onVender }) {
  return (
    <li className={`objeto objeto--${objeto.rareza}`}>
      <span className="objeto__icono" aria-hidden="true">
        {objeto.icono}
      </span>
      <span className="objeto__texto">
        <span className="objeto__nombre">{objeto.nombre}</span>
        <span className="objeto__detalle">
          <span className="objeto__rareza">{ETIQUETA_RAREZA[objeto.rareza]}</span> ·{' '}
          {efectoDe(objeto)}
        </span>
      </span>
      <button
        type="button"
        className="objeto__vender"
        aria-label={`Vender ${objeto.nombre}`}
        // TODO 3.5: Al pulsar el botón hay que llamar a onVender con el id de ESTE objeto.
        // Pista: onVender necesita un argumento, así que envuélvela en una función flecha
        // (tema 3, "Eventos con parámetros").
      >
        Vender · {precioDeVenta(objeto)} 🪙
      </button>
    </li>
  );
}
