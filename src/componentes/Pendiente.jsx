export default function Pendiente({ todo }) {
  return (
    <span className="pendiente" title="Este trozo todavía no está hecho">
      🚧 Pendiente: TODO {todo}
    </span>
  );
}
