import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router';
import Bestiario from './componentes/Bestiario';
import Combate from './componentes/Combate';
import CrearHeroe from './componentes/CrearHeroe';
import Diario from './componentes/Diario';
import HeroCard from './componentes/HeroCard';
import Mochila from './componentes/Mochila';
import Panel from './componentes/Panel';
import Taberna from './componentes/Taberna';
import { MonederoContext } from './contexto/MonederoContext';
import { monstruos } from './datos/monstruos';
import { buscarFicha } from './logica/bestiario';
import { recompensaPor } from './logica/combate';
import { completarMision, misionActiva } from './logica/gremio';
import { bonusDe, precioDeVenta } from './logica/objetos';
import { usePartida } from './partida/usePartida';

// La mazmorra: la página principal ("/"). No hace falta tocarla para los ejercicios.
// La cabecera y el menú están en src/paginas/Layout (react-06).
//
// El héroe y la mochila son de la partida (src/partida): los usan también otras páginas, como la
// tienda. Aquí se leen con usePartida() y se reparten a cada panel por props, con las funciones
// para cambiarlos (tema 4, "Lifting state up").
export default function App() {
  const partida = usePartida();
  const { heroe, heroeEquipado, objetos } = partida;
  const { arma, armadura } = partida.equipo;

  // El monedero es de react-07. Hasta que esté hecho, no hay oro (vale null) y las victorias no pagan.
  const monedero = useContext(MonederoContext);

  // Si se llega desde la ficha de un monstruo (react-06), la dirección es /?rival=3: ese es el rival.
  const [parametros] = useSearchParams();
  const [monstruo, setMonstruo] = useState(
    () => buscarFicha(parametros.get('rival')) ?? monstruos[0],
  );

  // Cada vez que sube, empieza un combate nuevo contra el mismo monstruo (ver la key de Combate)
  const [ronda, setRonda] = useState(0);
  const recompensa = recompensaPor(monstruo);

  // La misión del gremio en la que estás apuntado (react-08), si hay alguna
  const [mision, setMision] = useState(misionActiva);
  const esLaMision = mision?.monstruo === monstruo.nombre;

  // Al vencer: oro (si ya hay monedero) y un cofre para la mochila. Si era el monstruo de la
  // misión, además, su recompensa y otro cofre.
  const alVencer = () => {
    monedero?.ganar(recompensa);
    partida.ganarCofre();
    if (mision && esLaMision) {
      monedero?.ganar(mision.recompensa);
      partida.ganarCofre();
      completarMision();
      setMision(null);
    }
  };

  return (
    <main className="app__contenido">
      <Panel titulo="Tu héroe">
        <HeroCard heroe={heroeEquipado} />
        <p className="nota">
          Equipo: {arma ? `${arma.icono} ${arma.nombre} (+${bonusDe(arma)} ⚔️)` : 'sin arma'} ·{' '}
          {armadura
            ? `${armadura.icono} ${armadura.nombre} (+${bonusDe(armadura)} 🛡️)`
            : 'sin armadura'}
        </p>
        <p className="nota">
          🪙 Oro: {monedero ? monedero.oro : '— (el monedero llega en react-07)'}
        </p>
      </Panel>

      <Panel titulo="Combate">
        {/* La key cambia cuando cambia el héroe, el monstruo o la ronda. Para React, una key
             distinta es un componente distinto: crea un Combate nuevo, con su estado desde cero
             (el monstruo con toda su vida). La vida del héroe y las pociones no se reinician: no son
             estado de Combate. Es la forma idiomática de "reiniciar" un componente (tema 5, "Cómo
             React reconcilia las listas"). */}
        <Combate
          key={`${heroe.nombre}-${monstruo.nombre}-${ronda}`}
          heroe={heroeEquipado}
          monstruo={monstruo}
          pociones={partida.pociones}
          onCambiarVida={partida.cambiarVida}
          onBeberPocion={partida.gastarPocion}
          onVictoria={alVencer}
        />

        <p className="nota">
          Recompensa por vencer: 🪙 {recompensa} y un cofre 🎁. Las pociones salen de la mochila;
          compra más en la tienda.
        </p>
        <p className="nota">
          📜{' '}
          {mision
            ? `Misión «${mision.nombre}»: vence a ${mision.monstruo} (🪙 ${mision.recompensa} y otro cofre).${
                esLaMision ? ' ¡Es este!' : ' Búscalo en el bestiario.'
              }`
            : 'Sin misión: apúntate a una en el gremio.'}
        </p>
        <button type="button" className="boton-secundario" onClick={() => setRonda((r) => r + 1)}>
          🔄 Otro combate
        </button>
      </Panel>

      <Panel titulo="Mochila">
        <Mochila
          objetos={objetos}
          onCambiarObjetos={partida.cambiarObjetos}
          onVendido={(objeto) => monedero?.ganar(precioDeVenta(objeto))}
        />

        <p className="nota">
          {monedero
            ? 'Al vender, cobras la mitad de lo que vale el objeto.'
            : 'Aún no hay monedero (react-07): lo que vendas no te dará oro.'}
        </p>
      </Panel>

      <Panel titulo="Crear héroe">
        <CrearHeroe onCrear={partida.cambiarHeroe} />
      </Panel>

      <Panel titulo="Bestiario">
        <Bestiario onElegir={setMonstruo} />
      </Panel>

      <Panel titulo="Taberna">
        <Taberna heroe={heroe} onCambiarVida={partida.cambiarVida} />
      </Panel>

      <Panel titulo="Diario">
        <Diario />
      </Panel>
    </main>
  );
}
