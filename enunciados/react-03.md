# react-03 · Listas y subir el estado

**Tema:** capítulo 5 (listas) y apartado 4.9 (lifting state up).
**Entrega:** `npm run entregar react-03`

> ¿Te quedaste atrás? Recupera las tareas anteriores con `npm run rescatar react-01` y `npm run rescatar react-02`.

Vas a hacer funcionar la mochila del héroe: un inventario que se puede filtrar por tipo, ordenado por valor, y un cofre que da objetos nuevos.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/componentes/Inventario` | 3.1 a 3.4 |
| `src/componentes/ObjetoItem` | 3.5 |
| `src/componentes/Mochila` | 3.6 y 3.7 |

## Antes de empezar: dónde vive el estado

Abre `src/componentes/Mochila` y lee el comentario del principio. `<Cofre>` añade objetos e `<Inventario>` los muestra y los vende. Como los dos necesitan la misma lista y son hermanos, el estado no puede estar en ninguno de ellos. Y no son los únicos que la usan: el combate gasta las pociones de la mochila, y la tienda (react-07) mete lo que compras. Por eso la lista vive todavía más arriba, en la partida (`src/partida`, ya hecha), y baja por props hasta quien la necesita. Eso es **subir el estado** (apartado 4.9).

```
Partida            ← aquí vive la lista (ya hecho)
└── App
    └── Mochila        ← recibe objetos, onCambiarObjetos y onVendido
        ├── Cofre      ← recibe onEncontrar
        └── Inventario ← recibe objetos y onVender
            └── ObjetoItem ← recibe un objeto y onVender (uno por objeto)
```

`Mochila` no guarda la lista: cuando el cofre da algo o tiras un objeto, calcula cómo queda la lista y se la pasa a la partida con `onCambiarObjetos(listaNueva)`.

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **3.1** | Pintar un `<ObjetoItem>` por objeto, con su `key` | 5.2 Renderizar una lista con `map` · 5.3 La prop `key` |
| **3.2** | Filtrar los objetos por el tipo elegido | 5.4 Filtrar antes de mapear |
| **3.3** | Ordenarlos por valor, de mayor a menor, sin modificar el original | 5.5 Ordenar listas |
| **3.4** | Avisar cuando no hay nada que mostrar (dos mensajes distintos) | 5.6 Listas vacías |
| **3.5** | Que el botón «Vender» llame a `onVender` con el id de su objeto | 3.7 Eventos con parámetros |
| **3.6** | Añadir a la mochila lo que sale del cofre, con un id nuevo | 5.7 Modificar listas mantenidas en estado |
| **3.7** | Vender: quitar el objeto de la mochila y avisar con `onVendido` para cobrarlo | 5.7 Modificar listas mantenidas en estado |

### Dos preguntas

- **En el 3.3:** ¿por qué hay que copiar el array antes de ordenarlo? Prueba a quitar la copia y ejecuta los tests: uno de ellos te lo explica.
- **En el 3.6:** el cofre da cinco objetos y luego vuelve a empezar. Si no le pones un id nuevo a cada objeto, ¿qué pasa al abrirlo seis veces y vender uno de los dos amuletos? Mira también la consola del navegador.

## Cómo saber que está bien

- **En el navegador:** la mochila empieza con cinco objetos (tres de ellos, pociones) ordenados por valor. Los filtros funcionan y, si filtras por «Tesoros», sale el aviso. Cada objeto dice para qué sirve (cuánto ataque o defensa da, o cuánto cura). El cofre añade objetos (con un borde de color según su rareza) y «Vender» los quita de la mochila; cuando hagas el monedero (react-07), además te los pagará a mitad de precio. Al principio solo hay un cofre; se gana otro con cada victoria. Fíjate también en el combate: el número de pociones es el de la mochila, y la mejor arma y la mejor armadura que lleves mejoran al héroe.
- **Con los tests:** `npm run probar react-03` debe dar 13 de 13.

