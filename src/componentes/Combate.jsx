import { useState } from 'react';
import {
  CURACION_POCION,
  calcularDanio,
  crearEntrada,
  mensajeAtaque,
  mensajePocion,
} from '../logica/combate';
import BotonAccion from './BotonAccion';
import Luchador from './Luchador';
import RegistroCombate from './RegistroCombate';

// Combate por turnos entre un héroe y un monstruo.
// Reglas (ya programadas en src/logica/combate):
//   - El daño de un golpe es ataque - defensa, como mínimo 1: calcularDanio(ataque, defensa).
//   - Una poción cura CURACION_POCION puntos de vida.
//
// Combate no es dueño de todo lo que usa. La vida del héroe también la muestran su ficha y la
// taberna, y las pociones están en la mochila: viven más arriba (en la partida) y Combate las recibe
// por props (heroe.vida y pociones). Para cambiarlas, avisa al padre con las funciones que recibe:
// onCambiarVida(vidaNueva), onBeberPocion() y onVictoria(). Es «levantar el estado»
// (tema 4, "Lifting state up"). La vida del monstruo, en cambio, solo importa aquí: es estado de Combate.
export default function Combate({
  heroe,
  monstruo,
  pociones,
  onCambiarVida,
  onBeberPocion,
  onVictoria,
}) {
  // TODO 2.2: Ahora mismo la vida del monstruo es una constante y nunca cambia.
  // Conviértela en estado con useState, con la vida máxima del monstruo como estado inicial.
  // Pista: const [valor, setValor] = useState(inicial) (tema 4, "useState: el primer hook").
  const vidaMonstruo = monstruo.vidaMax;

  // Ya hecho: el registro de combate es una lista de mensajes guardada en el estado.
  // Fíjate en cómo `anotar` añade un mensaje SIN modificar el array anterior (tema 4, "Inmutabilidad"),
  // con la forma funcional del setter (tema 4, "Actualizaciones funcionales").
  const [registro, setRegistro] = useState([]);
  const anotar = (texto) => {
    setRegistro((anterior) => [...anterior, crearEntrada(texto)]);
  };

  // TODO 2.6: El combate termina cuando el héroe (heroe.vida) o el monstruo se quedan sin vida.
  // No lo guardes en el estado: calcúlalo a partir de las dos vidas (tema 4, "Estado derivado").
  const combateTerminado = false;

  const atacar = () => {
    const danio = calcularDanio(heroe.ataque, monstruo.defensa);

    // TODO 2.3: El héroe golpea al monstruo.
    //   1. Calcula la nueva vida del monstruo: la actual menos `danio`, pero nunca por debajo de 0
    //      (Math.max te ayuda) y guárdala en la constante `nuevaVidaMonstruo`.
    //   2. Actualiza el estado de la vida del monstruo con ese valor.
    //   3. Anota en el registro: mensajeAtaque(nombre del héroe, nombre del monstruo, danio).
    //   4. Si con este golpe el monstruo se queda a 0, avisa al padre: onVictoria().
    //      (Él se encarga de la recompensa: tema 3, "Callbacks como props").
    const nuevaVidaMonstruo = vidaMonstruo;

    // TODO 2.4: Si el monstruo sigue vivo (usa `nuevaVidaMonstruo`, no el estado: ¿por qué?),
    // contraataca: calcula su daño con calcularDanio(ataque del monstruo, defensa del héroe),
    // y anótalo en el registro. La vida nueva del héroe es heroe.vida menos ese daño, sin bajar
    // de 0: no la guardes aquí, pásasela al padre con onCambiarVida(vidaNueva).
  };

  const beberPocion = () => {
    // TODO 2.5: Si quedan pociones (la prop `pociones` es cuántas hay en la mochila):
    //   - el héroe recupera CURACION_POCION puntos de vida, sin pasar de su vidaMax (Math.min),
    //     y como antes, la vida nueva se la pasas al padre con onCambiarVida,
    //   - la poción se gasta: avisa al padre con onBeberPocion() (él la quita de la mochila),
    //   - y se anota mensajePocion(nombre del héroe, CURACION_POCION).
  };
  return (
    <div className="combate">
      <div className="combate__arena">
        <Luchador
          nombre={heroe.nombre}
          avatar={heroe.avatar}
          vida={heroe.vida}
          vidaMax={heroe.vidaMax}
        />
        <span className="combate__vs" aria-hidden="true">
          VS
        </span>
        <Luchador
          nombre={monstruo.nombre}
          avatar={monstruo.avatar}
          vida={vidaMonstruo}
          vidaMax={monstruo.vidaMax}
        />
      </div>

      {combateTerminado && (
        <p className="combate__resultado" role="status">
          {vidaMonstruo === 0 ? '🏆 ¡Victoria!' : '💀 Derrota'}
        </p>
      )}

      <div className="combate__acciones">
        <BotonAccion texto="Atacar" icono="⚔️" onAccion={atacar} deshabilitado={combateTerminado} />
        <BotonAccion
          texto={`Poción (${pociones})`}
          icono="🧪"
          onAccion={beberPocion}
          deshabilitado={combateTerminado || pociones === 0}
        />
      </div>

      <RegistroCombate entradas={registro} />
    </div>
  );
}
