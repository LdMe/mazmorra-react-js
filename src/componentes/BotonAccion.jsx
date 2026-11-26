// Botón para una acción del combate (atacar, beber poción...).
export default function BotonAccion({ texto, icono, onAccion, deshabilitado = false }) {
  return (
    <button
      type="button"
      className="boton-accion"
      // TODO 2.1: Cuando se pulse el botón debe llamarse a la función `onAccion` que llega por props.
      // Además, el botón debe quedar desactivado (atributo disabled) cuando `deshabilitado` sea true.
      // Cuidado: hay que PASAR la función, no llamarla (tema 3, "Manejo de eventos").
    >
      <span aria-hidden="true">{icono}</span> {texto}
    </button>
  );
}
