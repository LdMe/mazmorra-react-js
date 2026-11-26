# react-07 · Context, useReducer, useRef y hooks propios

**Tema:** capítulo 8 (hooks avanzados y personalizados).
**Entrega:** `npm run entregar react-07`

Vas a darle al héroe un monedero que se comparte entre páginas: las victorias en la mazmorra dan oro, y en la tienda (`/tienda`) se gasta en pociones y equipo, que van a la mochila. El oro vive en un **contexto**, se gestiona con un **reducer**, el campo para comprar pociones usa una **ref**, y de paso harás dos **hooks propios**: `useMonedero` y `useLocalStorage`, con el que la partida (tu héroe, su mochila y sus cofres) se guardará aunque recargues.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/hooks/useLocalStorage` | 7.1 |
| `src/logica/monedero` | 7.2 |
| `src/contexto/MonederoProvider` | 7.3 |
| `src/hooks/useMonedero` | 7.4 |
| `src/componentes/Monedero` | 7.5 y 7.6 |
| `src/componentes/Tienda` | 7.7 |

Ya están hechos el contexto (`src/contexto/MonederoContext`), la página de la tienda y el `<MonederoProvider>` que envuelve a toda la app en `src/main`.

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **7.1** | `useLocalStorage`: como `useState`, pero guardado en `localStorage` | 8.5 Hooks personalizados («Ejemplo 1: useLocalStorage») |
| **7.2** | El reducer del monedero: `GANAR`, `COMPRAR` y `REINICIAR` | 8.2 useReducer |
| **7.3** | El proveedor: `useReducer` (guardado en `localStorage`) y `<MonederoContext value={...}>` | 8.3 useContext · 8.2 |
| **7.4** | `useMonedero`: leer el contexto, con un error claro si falta el proveedor | 8.3 · 8.5 Hooks personalizados |
| **7.5** | El monedero muestra el oro compartido | 8.3 useContext |
| **7.6** | Comprar pociones con un campo no controlado y una ref | 8.4 useRef («Acceder a elementos del DOM») |
| **7.7** | La tienda: comprar (y entregar la compra con `onComprado`), y desactivar lo comprado y lo que no se puede pagar | 8.3 useContext |

Un orden que funciona: 7.2 → 7.3 → 7.4 → 7.5 → 7.7 → 7.6, y el 7.1 cuando quieras (no depende de los demás).

### Para pensar

- Monedero y Tienda no se pasan ninguna prop, y aun así lo que compra una lo ve el otro. ¿Quién guarda el oro? ¿Qué habría que hacer sin contexto?
- Compra algo, vete al bestiario y vuelve a la tienda: el oro sigue igual. Ahora mira `src/main`: ¿por qué el proveedor está *fuera* del router? ¿Qué pasaría si estuviera dentro de `PaginaTienda`?
- Crea un héroe en la mazmorra y recarga la página. Con el 7.1 hecho, sigue ahí. Mira en las herramientas del navegador (pestaña *Aplicación* → *Local Storage*) cómo se guarda.
- ¿Por qué el reducer no puede hacer `estado.oro += cantidad`? Pista: React compara el estado anterior con el nuevo para saber si tiene que volver a pintar.

## Cómo saber que está bien

- **En el navegador:** en la tienda empiezas con 100 monedas. Al comprar baja el oro y lo comprado aparece en la mochila: las armas y armaduras quedan «Comprado» (y mejoran al héroe si son mejores que las que lleva), y lo que no puedes pagar sale desactivado. Las pociones se compran en el monedero, tantas como pidas y puedas pagar; después, el campo se vacía y puedes escribir otra cantidad sin tocar el ratón. Con el monedero hecho, cada victoria en la mazmorra da oro (lo ves en la ficha del héroe), y el oro sigue ahí al recargar. Con el 7.1, también la partida (héroe, mochila y cofres).
- **Con los tests:** `npm run probar react-07` debe dar 17 de 17. Los tests de los hooks usan `renderHook`, que ejecuta un hook sin necesidad de un componente.

