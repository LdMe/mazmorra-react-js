import BarraVida from './BarraVida';
import Stat from './Stat';
import Pendiente from './Pendiente';

// Tarjeta con los datos de un héroe. Recibe un objeto `heroe` como el de src/datos/heroes.
export default function HeroCard({ heroe }) {
  // TODO 1.4 (parte 1): Un héroe está derrotado cuando su vida es 0. En ese caso, la tarjeta
  // lleva las clases "heroe-card derrotado"; si no, solo "heroe-card".
  // Pista: guarda el booleano en una constante y usa el operador ternario (tema 3, "Renderizado condicional").
  const clases = 'heroe-card';

  return (
    <article className={clases}>
      <header className="heroe-card__cabecera">
        <span className="heroe-card__avatar" aria-hidden="true">
          {heroe.avatar}
        </span>
        <div>
          {/* TODO 1.1: Muestra el nombre del héroe en un <h3 className="heroe-card__nombre">
               y, debajo, un <p className="heroe-card__subtitulo"> con el texto "Nivel 3 · Guerrera"
               (usa heroe.nivel y heroe.clase). Pista: expresiones con llaves en JSX (tema 1). */}
          <Pendiente todo="1.1" />
        </div>
      </header>

      {/* TODO 1.3: Una lista <ul className="heroe-card__stats"> con dos componentes <Stat>:
           uno con etiqueta "Ataque", icono "⚔️" y el ataque del héroe, y otro con etiqueta
           "Defensa", icono "🛡️" y la defensa del héroe. Pista: tema 3, "Composición de componentes". */}
      <Pendiente todo="1.3" />

      {/* TODO 1.4 (parte 2): Si el héroe está derrotado, muestra
           <p className="heroe-card__derrotado">💀 Derrotado</p>. Si no, muestra su barra de vida:
           <BarraVida> con el nombre, la vida y la vidaMax del héroe. */}
      <Pendiente todo="1.4" />
    </article>
  );
}
