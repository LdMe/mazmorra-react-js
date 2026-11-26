// Componente ya hecho: un cofre que, cada vez que se abre, entrega el siguiente objeto
// de src/datos/objetos (contenidoCofres) a quien lo use, a través de la prop onEncontrar.
//
// En el juego, los cofres los lleva la partida: se empieza con uno y se gana otro con cada victoria,
// y lo que sale es al azar (las legendarias son muy raras: ver objetoAlAzar en src/logica/objetos).
// Fuera de la partida (por ejemplo, en los tests de la mochila) se pueden abrir sin límite y dan
// siempre los mismos objetos en el mismo orden, para que los tests sepan qué esperar.
import { useContext, useState } from 'react';
import { contenidoCofres } from '../datos/objetos';
import { objetoAlAzar } from '../logica/objetos';
import { PartidaContext } from '../partida/PartidaContext';

export default function Cofre({ onEncontrar }) {
  const partida = useContext(PartidaContext);
  const [abiertosSinPartida, setAbiertosSinPartida] = useState(0);

  const abiertos = partida ? partida.cofres.abiertos : abiertosSinPartida;
  const disponibles = partida ? partida.cofres.disponibles : Infinity;

  const abrir = () => {
    const objeto = partida
      ? objetoAlAzar(contenidoCofres)
      : contenidoCofres[abiertos % contenidoCofres.length];
    if (partida) partida.abrirCofre();
    else setAbiertosSinPartida((n) => n + 1);
    onEncontrar(objeto);
  };

  return (
    <button
      type="button"
      className="cofre"
      onClick={abrir}
      disabled={disponibles === 0}
      title={disponibles === 0 ? 'Gana un combate para conseguir otro cofre' : undefined}
    >
      <span aria-hidden="true">{disponibles === 0 ? '🔒' : '🎁'}</span> Abrir cofre
      {partida && ` (${disponibles})`}
    </button>
  );
}
