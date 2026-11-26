import { useState } from 'react';
import { ETIQUETA_FILTRO, FILTROS } from '../logica/objetos';
import ObjetoItem from './ObjetoItem';
import Pendiente from './Pendiente';

// Lista de objetos de la mochila, con filtro por tipo y ordenada por valor.
export default function Inventario({ objetos, onVender }) {
  // Ya hecho: el filtro elegido ('todos', 'arma', 'armadura'...) se guarda en el estado.
  const [filtro, setFiltro] = useState('todos');

  // TODO 3.2: `visibles` son los objetos cuyo tipo coincide con el filtro.
  // Si el filtro es 'todos', son todos los objetos.
  // Pista: tema 5, "Filtrar antes de mapear".
  const visibles = objetos;

  // TODO 3.3: `ordenados` son los visibles ordenados por valor, de mayor a menor.
  // Cuidado: .sort() modifica el array sobre el que se llama, y `visibles` puede ser
  // directamente la prop `objetos` (tema 5, "Ordenar listas").
  const ordenados = visibles;

  return (
    <div className="inventario">
      <div className="inventario__filtros" role="group" aria-label="Filtrar por tipo">
        {FILTROS.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className="inventario__filtro"
            aria-pressed={filtro === opcion}
            onClick={() => setFiltro(opcion)}
          >
            {ETIQUETA_FILTRO[opcion]}
          </button>
        ))}
      </div>

      {/* TODO 3.1: Pinta un <ObjetoItem> por cada objeto de `ordenados`, pasándole el objeto
           y onVender. Pista: .map() y la prop key (tema 5, "Renderizar una lista con map" y
           "La prop key"). ¿Qué valor de cada objeto sirve como key? */}
      <ul className="inventario__lista" aria-label="Objetos de la mochila">
        <li>
          <Pendiente todo="3.1" />
        </li>
      </ul>

      {/* TODO 3.4: Si no hay ningún objeto que mostrar, añade un <p className="inventario__vacio">:
           "La mochila está vacía." si no hay objetos en absoluto, o
           "No tienes objetos de este tipo." si los hay pero el filtro los oculta.
           Pista: tema 5, "Listas vacías" (y cuidado con && y los números, tema 3). */}
    </div>
  );
}
