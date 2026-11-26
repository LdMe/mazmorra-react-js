import { useRef } from 'react';
import { pocionTienda } from '../datos/tienda';
import { useMonedero } from '../hooks/useMonedero';

// El monedero: cuánto oro hay y un formulario para comprar pociones (tantas como se puedan pagar).
export default function Monedero({ onComprado }) {
  // TODO 7.5: Saca oro y comprar del monedero compartido con tu hook useMonedero.
  // Hasta que lo hagas, el monedero siempre está vacío.
  const oro = 0;

  // TODO 7.6: El campo de la cantidad NO está controlado (no tiene value ni onChange): su valor
  // solo se lee al enviar el formulario. Para eso hace falta una referencia al <input>:
  //   - crea una ref con useRef (en TS, useRef<HTMLInputElement>(null)) y pásasela al input (ref={...}),
  //   - en comprarPociones, lee el número escrito (Number(campo.value)). Se compran esas pociones,
  //     pero como mucho las que se puedan pagar (Math.floor(oro / pocionTienda.valor)). Por cada una:
  //     comprar(pocionTienda) (eso paga) y onComprado(pocionTienda) (eso la mete en la mochila),
  //   - después, vacía el campo (campo.value = '') y devuélvele el foco (campo.focus()), para
  //     poder escribir otra cantidad sin tocar el ratón.
  // (Tema 8, "useRef: acceder a elementos del DOM".)

  const comprarPociones = (e) => {
    e.preventDefault();
  };

  return (
    <div className="monedero">
      <p className="monedero__oro">
        <span aria-hidden="true">🪙</span> <strong>{oro}</strong> monedas de oro
      </p>

      <form className="monedero__ingreso" onSubmit={comprarPociones}>
        <label className="campo">
          Pociones de vida ({pocionTienda.valor} 🪙 cada una)
          <input type="number" name="cantidad" min="1" />
        </label>
        <button type="submit" className="boton-accion">
          Comprar
        </button>
      </form>
    </div>
  );
}
