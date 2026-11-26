// Botón de envío para los formularios del gremio. Sirve para cualquier formulario con action.
export default function BotonEnviar({ children }) {
  // TODO 8.3: Mientras el formulario en el que está se envía, el botón tiene que estar desactivado
  // y decir "Enviando…" en lugar de su contenido. Saca `pending` de useFormStatus.
  // Fíjate en que no recibe ninguna prop para saberlo: useFormStatus lo averigua solo, porque el
  // botón está dentro del <form>. Cuidado: se importa de 'react-dom', no de 'react'.
  // (Tema 9, "useFormStatus".)
  const pending = false;

  return (
    <button type="submit" className="boton-accion" disabled={pending}>
      {pending ? 'Enviando…' : children}
    </button>
  );
}
