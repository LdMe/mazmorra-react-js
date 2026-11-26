import Cofre from './Cofre';
import Inventario from './Inventario';

// La mochila del héroe.
//
// Fíjate en dónde vive la lista: <Cofre> añade objetos e <Inventario> los muestra y los vende. Son
// hermanos, así que la lista no puede estar en ninguno de los dos. Y no solo ellos la usan: el combate
// gasta las pociones y la tienda mete lo que compras. Por eso vive todavía más arriba, en la partida,
// y Mochila la recibe en `objetos` junto con onCambiarObjetos, para avisar de cómo queda después de
// cada cambio (tema 4, "Lifting state up").
export default function Mochila({ objetos, onCambiarObjetos, onVendido }) {
  const encontrar = (objeto) => {
    // TODO 3.6: Añade el objeto encontrado al FINAL de la lista, sin modificar el array que recibes:
    // crea una lista nueva y pásasela al padre con onCambiarObjetos.
    // Ojo: el cofre puede dar dos veces el mismo objeto, y cada uno necesita una key distinta.
    // Guarda una copia del objeto con un id nuevo: { ...objeto, id: crypto.randomUUID() }.
    // Pista: tema 5, "Modificar listas mantenidas en estado".
  };
  const vender = (id) => {
    // TODO 3.7: Vender un objeto:
    //   - quita de la lista el objeto con ese id, sin modificar el array que recibes, y pásale la
    //     lista nueva al padre con onCambiarObjetos,
    //   - y avisa al padre con onVendido(objeto), pasándole el objeto vendido (búscalo con .find),
    //     para que te lo pague.
  };
  return (
    <div className="mochila">
      <Cofre onEncontrar={encontrar} />
      <Inventario objetos={objetos} onVender={vender} />
    </div>
  );
}
