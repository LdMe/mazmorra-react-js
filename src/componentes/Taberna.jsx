import { useEffect, useState } from 'react';

const PV_POR_SEGUNDO = 5;

// La taberna: mientras el héroe descansa, cada segundo recupera algo de vida.
// La vida se la suma al levantarse (eso ya está hecho, en alternarDescanso).
export default function Taberna({ heroe, onCambiarVida }) {
  const [descansando, setDescansando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const recuperada = segundos * PV_POR_SEGUNDO;

  // TODO 5.3: Mientras `descansando` sea true, suma 1 a `segundos` cada segundo (setInterval).
  // Cuando deje de descansar (o el componente desaparezca), el intervalo tiene que pararse:
  // devuelve una función de limpieza que lo cancele con clearInterval.
  // Pistas: si no está descansando, el efecto no tiene que hacer nada (return).
  // Usa la forma funcional del setter. ¿Qué va en el array de dependencias?
  // (tema 7, "Función de limpieza").

  // Ya hecho: al empezar a descansar, el contador vuelve a 0; al levantarse, el héroe recupera
  // la vida descansada (sin pasar de su máximo). Como en Combate, la vida se cambia con onCambiarVida.
  const alternarDescanso = () => {
    if (descansando) {
      onCambiarVida(Math.min(heroe.vidaMax, heroe.vida + recuperada));
    } else {
      setSegundos(0);
    }
    setDescansando(!descansando);
  };

  return (
    <div className="taberna">
      <p className="taberna__fuego" aria-hidden="true">
        {descansando ? '🔥' : '🪵'}
      </p>
      <p className="taberna__contador">
        Descansando: {segundos} s · +{recuperada} PV
      </p>
      <p className="taberna__vida">
        ❤️ {heroe.nombre}: {heroe.vida} / {heroe.vidaMax} PV
      </p>
      <button type="button" className="boton-accion" onClick={alternarDescanso}>
        {descansando ? '🚶 Levantarse' : '🛏️ Descansar'}
      </button>
    </div>
  );
}
