import App from '../App';
import Pendiente from '../componentes/Pendiente';

// El layout: lo que se ve en todas las páginas (la cabecera con el menú) y, debajo, la página actual.
export default function Layout() {
  return (
    <div className="app">
      <header className="app__cabecera">
        <h1>⚔️ La Mazmorra de React</h1>
        <p>Completa los TODO de cada tema y mira cómo crece el juego.</p>

        <nav className="menu" aria-label="Menú principal">
          {/* TODO 6.1: Cuatro enlaces de menú con NavLink, con la clase "menu__enlace":
                 "🏰 Mazmorra" a "/", "📖 Bestiario" a "/bestiario", "🛒 Tienda" a "/tienda" y
                 "📜 Gremio" a "/gremio".
               NavLink marca solo el enlace de la página actual (con aria-current="page"); con
               className={({ isActive }) => ...} añade también la clase "menu__enlace--activo".
               Cuidado: "/" coincide con todas las direcciones. Para que el enlace de la mazmorra
               solo se marque en "/", añádele la prop `end`.
               (Tema 11, "NavLink".) */}
          <Pendiente todo="6.1 (menú)" />
        </nav>
      </header>

      {/* TODO 6.2: Aquí va la página de la dirección actual. Sustituye <App /> por <Outlet />:
             React Router pondrá en su lugar la ruta hija que toque (tema 11, "Layouts y Outlet").
             Hasta que lo hagas, siempre se ve la mazmorra, sea cual sea la dirección. */}
      <App />
    </div>
  );
}
