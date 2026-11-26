export default function BarraVida({ nombre, vida, vidaMax }) {
  const porcentaje = Math.round((vida / vidaMax) * 100);
  // El color cambia según lo que queda de vida
  const nivel = porcentaje > 50 ? 'alta' : porcentaje > 20 ? 'media' : 'baja';

  return (
    <div className="barra-vida">
      <div
        className="barra-vida__marco"
        role="meter"
        aria-label={`Vida de ${nombre}`}
        aria-valuemin={0}
        aria-valuemax={vidaMax}
        aria-valuenow={vida}
      >
        <div
          className={`barra-vida__relleno barra-vida__relleno--${nivel}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="barra-vida__texto">
        {vida} / {vidaMax} PV
      </span>
    </div>
  );
}
