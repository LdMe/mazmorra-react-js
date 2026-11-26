# react-01 · Componentes y props

**Tema:** capítulos 1 a 3 (JSX, componentes, props, `children`, composición y renderizado condicional).
**Entrega:** `npm run entregar react-01`

Vas a construir la tarjeta del héroe que aparece en el panel «Tu héroe». Al empezar, el panel muestra solo un recuadro 🚧: el componente `Panel` todavía no pinta nada.

## Archivos

Las rutas van sin extensión: en tu proyecto serán `.jsx` o `.tsx`.

| Archivo | TODOs |
| --- | --- |
| `src/componentes/HeroCard` | 1.1, 1.3, 1.4 |
| `src/componentes/Stat` | 1.2 |
| `src/componentes/Panel` | 1.5 |

Antes de empezar, **lee** `src/componentes/BarraVida`: ya está hecho y es un buen ejemplo de un componente con props.

## TODOs

Te recomendamos este orden, porque es el de la teoría:

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **1.1** | Mostrar el nombre del héroe y el texto «Nivel 3 · Guerrera» | 1.4 JSX: expresiones embebidas |
| **1.2** | Crear el componente `Stat`, con un icono por defecto | 3.3 Props · Valores por defecto |
| **1.3** | Usar dos `Stat` dentro de `HeroCard` (ataque y defensa) | 3.5 Composición de componentes |
| **1.4** | Si la vida es 0, mostrar «💀 Derrotado» en lugar de la barra y añadir la clase `derrotado` | 3.6 Renderizado condicional |
| **1.5** | Hacer que `Panel` muestre su título y lo que lleve dentro | 3.4 La prop especial `children` |

Hasta que no hagas el **1.5** no verás la tarjeta en el navegador, porque está dentro de un `Panel`. Si quieres ir viendo tus avances desde el principio, empieza por el 1.5.

## Cómo saber que está bien

- **En el navegador** (`npm run dev`): desaparecen los recuadros 🚧 y aparece la tarjeta de Aria con su nivel, sus estadísticas y la barra de vida.
- **Prueba el caso «derrotado»:** en `src/datos/heroes`, cambia temporalmente la `vida` de Aria a `0`. La tarjeta debe ponerse gris y mostrar «💀 Derrotado». Luego déjalo como estaba.
- **Con los tests:** `npm run probar react-01` debe dar 11 de 11.

