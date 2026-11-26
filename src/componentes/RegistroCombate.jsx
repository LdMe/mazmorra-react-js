// Componente ya hecho. Usa .map() para pintar una lista: lo veremos a fondo en el tema de listas.

export default function RegistroCombate({ entradas }) {
  if (entradas.length === 0) {
    return <p className="registro registro--vacio">El combate aún no ha empezado.</p>;
  }

  return (
    <ol className="registro" aria-label="Registro de combate">
      {entradas.map((entrada) => (
        <li key={entrada.id}>{entrada.texto}</li>
      ))}
    </ol>
  );
}
