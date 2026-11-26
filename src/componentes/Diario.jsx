import { useEffect, useState } from 'react';

const CLAVE = 'mazmorra-diario';

// Un diario del aventurero que se guarda en el navegador: si recargas la página, sigue ahí.
export default function Diario() {
  // TODO 5.4: El valor inicial del diario es lo que haya guardado en localStorage con la clave
  // CLAVE, o '' si no hay nada. Léelo solo la primera vez: pasa una FUNCIÓN a useState
  // (tema 4, "Tipos de valores en el estado", y tema 7, "Sincronización con localStorage").
  const [texto, setTexto] = useState('');

  // TODO 5.5: Cada vez que cambie `texto`, guárdalo en localStorage con la clave CLAVE.

  return (
    <div className="diario">
      <label htmlFor="diario-texto">Diario del aventurero</label>
      <textarea
        id="diario-texto"
        rows={4}
        placeholder="Hoy he derrotado a un goblin..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <small>Se guarda solo. Prueba a recargar la página.</small>
    </div>
  );
}
