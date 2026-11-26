# react-08 · Actions de React 19

**Tema:** capítulo 9 (Actions de React 19).
**Entrega:** `npm run entregar react-08`

En el gremio (`/gremio`) hay dos formularios: uno para apuntarse a una misión y un tablón de rumores. Los dos hablan con un «servidor» lento (`src/logica/gremio`, ya hecho), y los vas a hacer con las herramientas de React 19 para formularios: sin `onSubmit`, sin `preventDefault` y sin un `useState` para cada cosa.

## Archivos

| Archivo | TODOs |
| --- | --- |
| `src/componentes/Inscripcion` | 8.1 y 8.2 |
| `src/componentes/BotonEnviar` | 8.3 |
| `src/componentes/Rumores` | 8.4 y 8.5 |

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **8.1** | La Action de la inscripción: leer la misión y los campos ocultos del héroe, validar, llamar al gremio y devolver el resultado | 9.2 Qué es una Action · 9.3 useActionState |
| **8.2** | Conectar la Action con `useActionState` | 9.3 useActionState |
| **8.3** | Un botón que sabe solo si su formulario se está enviando | 9.4 useFormStatus |
| **8.4** | La Action del tablón: publicar el rumor y añadirlo a la lista | 9.2 Qué es una Action |
| **8.5** | Que el rumor salga al momento, antes de que responda el gremio | 9.5 useOptimistic |

### Para pensar

- `BotonEnviar` se usa en los dos formularios y no recibe ninguna prop para saber si se están enviando. ¿Cómo lo sabe? ¿Funcionaría fuera de un `<form>`?
- Elige una misión y envíala: el desplegable vuelve solo a «Elige una misión…». Es lo que hace React con los formularios que tienen `action`. ¿Te parece buena idea cuando hay un error?
- Antes de hacer el 8.5, publica un rumor: tarda casi un segundo en salir. Después del 8.5, sale al momento. ¿Qué pasaría si el servidor fallara?
- Intenta apuntarte a «Matar al dragón» con el arma del principio. ¿Qué tendrías que hacer para que el gremio te deje?

## Cómo saber que está bien

- **En el navegador:** si no eliges misión, sale el error al momento. Con una misión, el botón dice «Enviando…» un momento y luego aparece la confirmación, o el aviso del gremio si a tu héroe le falta ataque. En el tablón, el rumor sale enseguida en gris con «(enviando…)» y luego se queda normal. Y la misión cuenta: en la mazmorra aparece como objetivo, y al vencer a su monstruo cobras la recompensa y un cofre. Lee los rumores del tablón antes de ir a por los monstruos difíciles.
- **Con los tests:** `npm run probar react-08` debe dar 7 de 7. Los tests sustituyen el «servidor» por uno falso que responde cuando ellos quieren, para poder ver qué pasa *mientras* se envía.

