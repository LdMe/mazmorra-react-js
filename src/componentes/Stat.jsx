import Pendiente from './Pendiente';

// TODO 1.2: Una estadística del héroe. Debe devolver un <li className="stat"> con
// el icono, la etiqueta y el valor en negrita. Por ejemplo, para el ataque:
//   <li className="stat"><span className="stat__icono">⚔️</span> Ataque: <strong>12</strong></li>
// Si no recibe `icono`, debe usar '•'.
// Pista: valores por defecto al desestructurar las props (tema 3, "Valores por defecto").
export default function Stat({ etiqueta, valor, icono }) {
  return (
    <li className="stat">
      <Pendiente todo="1.2" />
    </li>
  );
}
