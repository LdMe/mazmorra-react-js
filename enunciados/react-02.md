# react-02 · Eventos y estado

**Tema:** capítulo 3 (manejo de eventos y callbacks como props) y capítulo 4 (estado con `useState`).
**Entrega:** `npm run entregar react-02`

> ¿No terminaste react-01? Recupera su solución antes de empezar: `npm run rescatar react-01`. Sin ella, el `Panel` no muestra nada y no verás el combate.

El panel «Combate» ya se ve, pero no pasa nada al pulsar los botones: los valores son constantes. Vas a darle vida con eventos y estado.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/componentes/BotonAccion` | 2.1 |
| `src/componentes/Combate` | 2.2 a 2.6 |

Las reglas del combate (cuánto daño hace un golpe, cuánto cura una poción, los textos del registro...) ya están programadas en `src/logica/combate`. Úsalas desde tus TODOs, no las reescribas.

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **2.1** | Que el botón llame a `onAccion` al pulsarlo y se desactive con `deshabilitado` | 3.7 Manejo de eventos · 3.8 Callbacks como props |
| **2.2** | Convertir la vida del monstruo en estado | 4.3 useState |
| **2.3** | Atacar: el monstruo pierde vida (sin bajar de 0), se anota en el registro y, si cae, se avisa con `onVictoria` | 4.3 useState · 4.10 El ciclo de actualización · 3.8 Callbacks como props |
| **2.4** | Si el monstruo sigue vivo, contraataca: la vida del héroe se cambia con `onCambiarVida` | 4.9 Lifting state up |
| **2.5** | Beber una poción: cura sin pasar del máximo y avisa con `onBeberPocion` para gastarla | 4.9 Lifting state up |
| **2.6** | Calcular si el combate ha terminado | 4.7 Estado derivado |

### ¿Por qué la vida del héroe y las pociones no son estado de `Combate`?

La vida del monstruo solo importa dentro del combate. La vida del héroe, en cambio, también la muestra su ficha y la cambia la taberna (react-05), y las pociones son las de la mochila. Si cada componente guardara su propia copia, cada uno diría una cosa distinta. Por eso viven más arriba, en la partida (`src/partida`, ya hecha), y `Combate` las recibe por props: `heroe.vida` y `pociones`. Para cambiarlas, avisa con las funciones que recibe: `onCambiarVida(vidaNueva)` y `onBeberPocion()`. Y cuando gana, `onVictoria()`, para que la partida dé la recompensa. Es lo que el apartado 4.9 llama «levantar el estado» (*lifting state up*).

Fíjate en `anotar`, dentro de `Combate`: ya está hecha y es un ejemplo de cómo añadir algo a un array del estado sin modificarlo (apartado 4.5, «Inmutabilidad»).

### Una pregunta para el TODO 2.4

El contraataque debe decidirse con `nuevaVidaMonstruo`, no con `vidaMonstruo`. ¿Por qué? Prueba a usar `vidaMonstruo` y ataca hasta derrotar al Goblin: ¿qué pasa en el último golpe? La respuesta está en el apartado 4.10 («El ciclo de actualización»).

## Cómo saber que está bien

- **En el navegador:** al atacar, las dos barras bajan y el registro se va llenando. La vida del héroe también baja en su ficha, en el panel «Tu héroe». Las pociones curan y se gastan. Las pociones salen de la mochila: al beber una, desaparece de ella. Al derrotar al Goblin aparece «🏆 ¡Victoria!», los botones se desactivan y ganas un cofre para la mochila (y, cuando hagas react-07, oro). «🔄 Otro combate» empieza otro contra el mismo monstruo, con el héroe tal y como haya quedado.
- **Prueba a perder:** en `src/App`, cambia `monstruos[0]` por `monstruos[2]` (el dragón) y no bebas pociones. Luego déjalo como estaba.
- **Con los tests:** `npm run probar react-02` debe dar 18 de 18.

### ¿Te has fijado?

La tarjeta de «Tu héroe» no baja de vida durante el combate: cada panel tiene su propia copia de los datos. Para compartirlos habría que **subir el estado** a un componente común (apartado 4.9, «Lifting state up»). Lo practicarás en la próxima tarea con la mochila del héroe.

