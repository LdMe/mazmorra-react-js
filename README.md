# ⚔️ La Mazmorra de React

Un pequeño juego de rol que vas a construir tú, tema a tema. El proyecto ya funciona, pero le faltan trozos: cada trozo es un **TODO** numerado (`TODO 1.1`, `TODO 2.3`...) que corresponde a lo que acabamos de ver en clase. Solo tienes que rellenar unas pocas líneas cada vez.

> Esta es la versión **JavaScript**. Si te animas con TypeScript, hay otra versión del repositorio con tareas bonus de tipos.

## Tareas

| Tarea | Tema | Tests | Enunciado |
| --- | --- | --- | --- |
| `react-01` | Componentes y props | 11 | [enunciados/react-01.md](enunciados/react-01.md) |
| `react-02` | Eventos y estado | 18 | [enunciados/react-02.md](enunciados/react-02.md) |
| `react-03` | Listas y subir el estado | 13 | [enunciados/react-03.md](enunciados/react-03.md) |
| `react-04` | Formularios | 9 | [enunciados/react-04.md](enunciados/react-04.md) |
| `react-05` | Efectos y peticiones a APIs | 12 | [enunciados/react-05.md](enunciados/react-05.md) |
| `react-06` | React Router | 15 | [enunciados/react-06.md](enunciados/react-06.md) |
| `react-07` | Context, useReducer, useRef y hooks propios | 17 | [enunciados/react-07.md](enunciados/react-07.md) |
| `react-08` | Actions de React 19 | 7 | [enunciados/react-08.md](enunciados/react-08.md) |

Todas las tareas están ya en el proyecto (por eso verás muchos 🚧 al principio), pero hazlas en orden, a medida que demos cada tema. Más adelante se añadirán tareas nuevas: antes de empezar cada tema, haz `git pull` y después `npm install`, por si hay dependencias nuevas (con React Router, por ejemplo).

## Antes de empezar (una vez)

1. Necesitas **Node 22.22 o posterior** (mejor, la versión LTS más reciente). Compruébalo con `node --version`.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea tu **token** en IkasBot: **Perfil → Tokens de API**, elige el curso y pulsa «Crear token». Cópialo: solo se muestra una vez.
4. Copia `.env.example` como `.env` y pega el token:

   ```bash
   cp .env.example .env
   ```

   ```
   IKASBOT_TOKEN=ikb_tu_token
   ```

> **El token es como una contraseña.** `.env` está en `.gitignore`, así que no se sube a GitHub. No lo quites de ahí ni lo pegues en ningún otro archivo.

## Cómo se trabaja

1. **Lee el enunciado** de la tarea (`enunciados/react-0X.md`): dice qué TODOs tiene y en qué archivos están.
2. **Arranca el juego** y déjalo abierto mientras trabajas:

   ```bash
   npm run dev
   ```

   Abre la dirección que aparece (normalmente <http://localhost:5173>). Cada trozo sin hacer se ve como un recuadro amarillo **🚧 Pendiente: TODO X.Y**. Cuando lo completes, desaparecerá.

3. **Rellena los TODOs.** Busca `TODO` en tu editor (en VS Code, `Ctrl+Shift+F`). Cada uno explica qué hay que hacer y en qué apartado del temario está la teoría. Sustituye la línea de `<Pendiente>` (o la constante provisional) por tu código.
4. **Comprueba con los tests**, en otra terminal, con el código de la tarea:

   ```bash
   npm run probar react-01      # los tests de la tarea, una vez
   npm run vigilar react-01     # se repiten solos cada vez que guardas (Ctrl+C para salir)
   npm run probar               # la lista de tareas
   ```

   Es el mismo comando que usa `npm run entregar`, así que lo que ves es lo que se evaluará.

5. **Haz commit** cuando acabes cada TODO. Así siempre puedes volver atrás.

> **No cambies los tests para que pasen.** Si un test falla, lo que hay que arreglar es el código. Además, al entregar se envía la huella de cada archivo de test: si se ha modificado, IkasBot lo detecta.

## Entregar

```bash
npm run entregar react-01
```

Ejecuta los tests de la tarea, envía el resultado y tu código a IkasBot y te muestra la nota:

```
✓ Intento 2 entregado
  Tests: 9/11 · nota 82 %
  Sin superar: HeroCard > muestra «Derrotado» en lugar de la barra si la vida es 0
  Tu mejor intento: #2 (82 %)
```

- Puedes entregar todas las veces que quieras antes del plazo: cuenta tu **mejor** intento.
- No pasa nada por entregar con tests que fallan: se entrega lo que hay.
- `npm run entregar` sin nada más lista las tareas.

## ¿Te has quedado atrás? Recupera la solución

Cuando cierra el plazo de una tarea, el profesorado publica su solución. Si no la terminaste, recupérala antes de empezar la siguiente, para no arrastrar el problema:

```bash
npm run rescatar react-01
```

- Sustituye **solo** los archivos de esa tarea por la solución oficial.
- Antes guarda tus versiones en `.rescate/`, por si quieres comparar.
- Después, mira con `git diff` qué hacía falta y haz commit.

Si la solución aún no está publicada, el comando te lo dirá. Las entregas que hagas después del plazo quedan marcadas como fuera de plazo.

## Si algo falla

| Mensaje | Qué hacer |
| --- | --- |
| `Falta tu token` | Crea el archivo `.env` (paso 4) |
| `IkasBot no acepta tu token` | Está revocado o es de otro curso: crea otro en el Perfil |
| `Tu archivo .env está subido a git` | Sigue los pasos que muestra: revoca el token y saca `.env` de git |
| `Los tests no han generado junit.xml` | Hay un error antes de los tests (sintaxis, `npm install` sin hacer…): léelo arriba |
| La página sale en blanco | Abre la consola del navegador (F12): casi siempre es un error de sintaxis en el último archivo que tocaste |
| `La solución de … todavía no está publicada` | Espera a que cierre el plazo de esa tarea |
