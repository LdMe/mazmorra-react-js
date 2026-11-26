# react-04 · Formularios

**Tema:** capítulo 6 (formularios controlados).
**Entrega:** `npm run entregar react-04`

Vas a hacer funcionar el formulario del panel «Crear héroe». Cuando los datos son válidos, el héroe nuevo sustituye a Aria en la tarjeta y en el combate.

## Archivo

Todo está en `src/componentes/CrearHeroe`. El estado (`datos`, `errores`), el HTML del formulario y los mensajes de error ya están hechos. Tú conectas los campos con el estado, calculas los puntos y validas.

Las reglas (puntos que repartir, clases, avatares, cómo se construye el héroe) están en `src/logica/heroes`.

## TODOs

| TODO | Qué hay que hacer | Teoría |
| --- | --- | --- |
| **4.1** | Escribir `alCambiar`, el manejador que sirve para todos los campos, y conectar el nombre | 6.2 Inputs controlados · 6.3 Ejemplo completo |
| **4.2** | Conectar el `<select>` de clase y los radios de avatar | 6.4 Selects, checkboxes y radios |
| **4.3** | Conectar ataque y defensa y calcular los puntos que quedan | 6.2 · 4.7 Estado derivado |
| **4.4** | Validar el nombre y los puntos | 6.6 Validación |
| **4.5** | Al enviar: guardar errores y, si no hay, crear el héroe y vaciar el formulario | 6.3 Ejemplo completo |

Haz el 4.1 primero: en cuanto lo tengas, la vista previa del formulario empezará a cambiar mientras escribes, y verás qué significa que un campo sea «controlado».

### Para pensar

- Escribe en «Ataque» antes de hacer el 4.3: el número aparece en el campo, pero la vista previa no cambia. ¿Dónde está guardado ese valor? Esa es la diferencia entre un campo controlado y uno no controlado.
- En `datos`, el ataque es `'12'` (texto), no `12`. ¿Por qué? ¿Qué devolvería `'12' + '8'`?

## Cómo saber que está bien

- **En el navegador:** la vista previa y los puntos se actualizan al escribir. Si envías el formulario vacío, salen los errores. Con datos correctos aparece «✅ … se une a la aventura», la tarjeta de «Tu héroe» cambia y el combate se reinicia con el héroe nuevo.
- **Con los tests:** `npm run probar react-04` debe dar 9 de 9.

### ¿Por qué se reinicia el combate?

Mira en `src/App` la `key` que lleva `<Combate>`. Cuando cambia el héroe, cambia la `key`, y React crea un combate nuevo con su estado desde cero (apartado 5.10, «Cómo React reconcilia las listas»).

