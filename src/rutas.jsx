import App from './App';
import FichaMonstruo from './paginas/FichaMonstruo';
import Layout from './paginas/Layout';
import NoEncontrada from './paginas/NoEncontrada';
import PaginaBestiario from './paginas/PaginaBestiario';
import PaginaGremio from './paginas/PaginaGremio';
import PaginaTienda from './paginas/PaginaTienda';
import PartidaProvider from './partida/PartidaProvider';

// Las rutas del juego. main.tsx crea el router con ellas, y los tests, uno de prueba.
export const rutas = [
  {
    path: '/',
    // La partida (héroe y mochila) envuelve a todas las páginas: es la misma en todas
    element: (
      <PartidaProvider>
        <Layout />
      </PartidaProvider>
    ),
    // TODO 6.3: Las páginas van como rutas hijas del layout (children), y se pintan en su <Outlet />:
    //   - la ruta índice (index: true) es la mazmorra: <App />,
    //   - "bestiario" es <PaginaBestiario />, y "bestiario/:id", la ficha de un monstruo: <FichaMonstruo />,
    //   - "tienda" es <PaginaTienda /> y "gremio", <PaginaGremio />,
    //   - y "*" (cualquier otra dirección) es <NoEncontrada />.
    // Las rutas hijas no empiezan por "/": heredan la del padre (tema 11, "index: true y rutas anidadas").
  },
];
