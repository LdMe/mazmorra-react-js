# react-05 · Efectos y peticiones a APIs

**Tema:** capítulo 7 (efectos y peticiones a APIs).
**Entrega:** `npm run entregar react-05`

Tres usos típicos de `useEffect`, cada uno en un panel:

- **Bestiario:** cargar datos de una API, con sus estados de carga y error.
- **Taberna:** un temporizador que hay que parar (función de limpieza).
- **Diario:** sincronizar con `localStorage`.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/componentes/Bestiario` | 5.1 y 5.2 |
| `src/componentes/Taberna` | 5.3 |
| `src/componentes/Diario` | 5.4 y 5.5 |

### La API

Para no depender de ningún servidor, la «API» es un archivo: `public/api/monstruos.json`. Vite sirve lo que hay en `public/` tal cual, así que `fetch('/api/monstruos.json')` funciona igual que con una API de verdad. Abre <http://localhost:5173/api/monstruos.json> en el navegador para ver qué devuelve.

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **5.1** | Pedir los monstruos al montar el componente, con `AbortController` | 7.8 Peticiones a APIs (el patrón loading / error / data) |
| **5.2** | Mostrar «Cargando…» o el error en lugar de la lista | 3.6 Early return |
| **5.3** | Contar segundos mientras se descansa y parar al levantarse | 7.5 Función de limpieza |
| **5.4** | Leer el diario de `localStorage` solo al empezar | 4.4 Tipos de valores en el estado · 7.6 Casos de uso típicos (localStorage) |
| **5.5** | Guardar el diario en `localStorage` cada vez que cambia | 7.6 Casos de uso típicos (localStorage) |

### Experimentos

- **Ver el «Cargando…»:** en las herramientas del navegador (F12), pestaña *Red*, elige una conexión lenta («3G lenta») y recarga.
- **Ver el error:** cambia temporalmente la URL de `src/logica/api` por una que no exista. ¿Qué mensaje sale? (Pista: Vite responde con la página principal, que no es JSON.)
- **Olvidar la limpieza:** quita el `return` del 5.3, pulsa varias veces «Descansar» / «Levantarse» y mira cómo se acelera el contador. Luego vuelve a ponerlo.
- **StrictMode:** con `console.log` dentro del efecto del 5.1, verás que en desarrollo se ejecuta dos veces. ¿Por qué no se duplican los monstruos? (Apartado «useEffect: estructura básica».)

## Cómo saber que está bien

- **En el navegador:** el bestiario carga seis monstruos, y «Luchar» cambia el rival del combate. En la taberna, el contador sube mientras descansas y, al levantarte, se para y el héroe recupera esa vida (se ve en su ficha y en el combate). El diario sigue ahí después de recargar la página.
- **Con los tests:** `npm run probar react-05` debe dar 12 de 12. Los tests no usan la red: sustituyen `fetch` por una versión falsa, igual que en el apartado de testing del temario.

