# react-06 · React Router

**Tema:** capítulo 11 (React Router).
**Entrega:** `npm run entregar react-06`

El juego deja de ser una sola página. Vas a darle un menú y cuatro direcciones: la mazmorra (`/`), el bestiario (`/bestiario`, con una ficha para cada monstruo en `/bestiario/3`), la tienda (`/tienda`) y el gremio (`/gremio`). Cualquier otra dirección muestra una página de «te has perdido».

El router ya está creado en `src/main` con `createBrowserRouter`, y las páginas de la tienda, del gremio y de «perdido» ya están hechas. Tú pones el menú, conectas las rutas y haces las páginas del bestiario.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/paginas/Layout` | 6.1 y 6.2 |
| `src/rutas` | 6.3 |
| `src/paginas/PaginaBestiario` | 6.4 y 6.5 |
| `src/paginas/FichaMonstruo` | 6.6 y 6.7 |

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **6.1** | El menú, con `NavLink`, marcando la página actual | 11.5 Navegación («NavLink») |
| **6.2** | Pintar la página actual con `<Outlet />` | 11.4 Layouts y Outlet |
| **6.3** | Las rutas hijas: índice, bestiario, ficha con `:id`, tienda, gremio y `*` | 11.3 Configuración básica · 11.4 («index: true y rutas anidadas») |
| **6.4** | Cada monstruo del bestiario es un `Link` a su ficha | 11.5 Navegación («Link») |
| **6.5** | El buscador del bestiario guarda lo que buscas en la dirección (`?buscar=`) | 11.6 Parámetros de URL («Query parameters») |
| **6.6** | La ficha lee el id de la dirección con `useParams` | 11.6 Parámetros de URL («Parámetros dinámicos») |
| **6.7** | «Luchar» lleva a la mazmorra con ese rival, con `useNavigate` | 11.5 Navegación («Navegación programática») |

Un orden que funciona: 6.2 y 6.3 primero (hasta entonces, se vea la dirección que se vea, siempre sale la mazmorra), luego el menú y después el bestiario.

### Para pensar

- Quita el `end` del enlace de la mazmorra. ¿Qué pasa con el menú cuando estás en el bestiario? ¿Por qué?
- Cambia un `Link` del bestiario por un `<a href>` y pulsa: en la pestaña *Red* de las herramientas del navegador verás que se vuelve a descargar toda la página. Luego deja el `Link`.
- Busca algo en el bestiario y recarga la página: la búsqueda sigue ahí. ¿Dónde estaba guardada?
- Abre una ficha y pulsa el botón «Atrás» del navegador. ¿Qué tiene que ver el historial con el router?

## Cómo saber que está bien

- **En el navegador:** el menú lleva a cada página y marca en dorado la actual. En el bestiario, cada monstruo abre su ficha; `/bestiario/99` dice que no existe, y `/lo-que-sea`, que te has perdido. «Luchar» te lleva a la mazmorra con ese monstruo de rival.
- **Con los tests:** `npm run probar react-06` debe dar 15 de 15. Los tests usan `createMemoryRouter`: un router que guarda la dirección en memoria, sin navegador.

