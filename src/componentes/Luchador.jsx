// Componente ya hecho: un luchador dentro del combate (avatar, nombre y barra de vida).
import BarraVida from './BarraVida';

export default function Luchador({ nombre, avatar, vida, vidaMax }) {
  return (
    <div className={vida === 0 ? 'luchador luchador--caido' : 'luchador'}>
      <span className="luchador__avatar" aria-hidden="true">
        {avatar}
      </span>
      <strong className="luchador__nombre">{nombre}</strong>
      <BarraVida nombre={nombre} vida={vida} vidaMax={vidaMax} />
    </div>
  );
}
