import { objetosIniciales } from '../datos/objetos';
import { heroes } from '../datos/heroes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { bonusDe, equipoDe } from '../logica/objetos';
import { PartidaContext } from './PartidaContext';

/**
 * La partida: el héroe y su mochila. Ya está hecha; no hace falta tocarla.
 *
 * El héroe y la mochila los usan componentes de páginas distintas (el combate, la taberna, la
 * mochila, la tienda...), así que viven aquí, por encima de todas las páginas (en src/rutas), y se
 * comparten con un contexto. Es lo mismo que harás tú con el monedero en react-07.
 *
 * Se guardan en localStorage con tu hook useLocalStorage (react-07): hasta que lo hagas,
 * la partida empieza de cero al recargar la página.
 */
export default function PartidaProvider({ children }) {
  const [heroe, setHeroe] = useLocalStorage('mazmorra-heroe', heroes[0]);
  const [objetos, setObjetos] = useLocalStorage('mazmorra-mochila', objetosIniciales);
  const [cofres, setCofres] = useLocalStorage('mazmorra-cofres', { disponibles: 1, abiertos: 0 });

  const pocionesOrdenadas = objetos
    .filter((objeto) => objeto.tipo === 'pocion')
    .sort((a, b) => a.valor - b.valor);

  // La mejor arma y la mejor armadura de la mochila mejoran al héroe
  const equipo = equipoDe(objetos);
  const heroeEquipado = {
    ...heroe,
    ataque: heroe.ataque + (equipo.arma ? bonusDe(equipo.arma) : 0),
    defensa: heroe.defensa + (equipo.armadura ? bonusDe(equipo.armadura) : 0),
  };

  const valor = {
    heroe,
    heroeEquipado,
    equipo,
    cambiarHeroe: (nuevo) => setHeroe(nuevo),
    cambiarVida: (vida) => setHeroe((actual) => ({ ...actual, vida })),
    objetos,
    cambiarObjetos: (lista) => setObjetos(lista),
    anadirObjeto: (objeto) =>
      setObjetos((actuales) => [...actuales, { ...objeto, id: crypto.randomUUID() }]),
    pociones: pocionesOrdenadas.length,
    gastarPocion: () => {
      const gastada = pocionesOrdenadas[0];
      if (gastada) setObjetos((actuales) => actuales.filter((objeto) => objeto.id !== gastada.id));
    },
    cofres,
    abrirCofre: () =>
      setCofres((actual) => ({
        disponibles: actual.disponibles - 1,
        abiertos: actual.abiertos + 1,
      })),
    ganarCofre: () => setCofres((actual) => ({ ...actual, disponibles: actual.disponibles + 1 })),
  };

  return <PartidaContext value={valor}>{children}</PartidaContext>;
}
