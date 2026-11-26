#!/usr/bin/env node
/*
  Prueba y entrega una tarea de IkasBot: ejecuta sus tests, envía el resultado y muestra la nota.
  Node 22.12 o posterior, sin dependencias. Es el mismo archivo en todos los proyectos de JavaScript y TypeScript.

  Alumnado:
    npm run probar <código-de-la-tarea>        ejecuta sus tests como al entregar, pero sin entregar nada
    npm run vigilar <código-de-la-tarea>       igual, y se repiten solos al guardar (si el comando es de Vitest)
    npm run entregar <código-de-la-tarea>      p. ej. npm run entregar strings-01
    npm run probar (o entregar)                lista las tareas

  Profesorado (en la versión con la solución):
    npm run entregar -- --preparar             rellena ikasbot.json y genera en ikasbot/ los junit y las huellas
    npm run entregar -- --huellas [tarea]      solo las huellas de los tests, para pegarlas en la tarea

  - Tu token va en el archivo .env (IKASBOT_TOKEN=ikb_…), que nunca se sube a git.
  - Cada carpeta de tests/ es una tarea (tests/strings-01/… → strings-01). Su código son los archivos de src/
    que importan sus tests. Lo que se escriba a mano en ikasbot.json (titulo, codigo, comando…) se respeta.
  - Envía también la huella (sha256) de cada archivo de test: si no coincide con la original, IkasBot avisa.
*/
import { spawnSync, execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync, statSync, mkdirSync, copyFileSync, chmodSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { dirname, join, relative, sep } from 'node:path';

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};
const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
};

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 12)) {
  fail(`Necesitas Node 22.12 o posterior (tienes ${process.versions.node}). Instala la LTS más reciente desde https://nodejs.org.`);
}

export const VITEST = 'npx vitest run {tests} --reporter=default --reporter=junit --outputFile.junit=junit.xml';
const VITEST_TYPES = 'npx vitest run --typecheck.only {tests} --reporter=default --reporter=junit --outputFile.junit=junit.xml';
const VITEST_BOTH = 'npx vitest run --typecheck {tests} --reporter=default --reporter=junit --outputFile.junit=junit.xml';
const TASK_CODE = /^[a-z0-9][a-z0-9_-]{0,59}$/;
const TEST_FILE = /\.(test|spec)(-d)?\.[cm]?[jt]sx?$/;
export const TYPE_TEST = /\.(test|spec)-d\.[cm]?[jt]sx?$/;
const byName = (a, b) => a.localeCompare(b, 'en', { numeric: true }); // strings-2 < strings-10
const posix = (p) => p.split(sep).join('/');

/* ---------- Profesorado: copia del alumnado con marcas (opcional) ----------
  Si el proyecto con la solución tiene marcas, --preparar genera además la copia del alumnado en ikasbot/alumnado/.
  Las marcas son comentarios solos en su línea, en mayúsculas y sin tilde:
    SOLUCION … ENUNCIADO … FIN   lo de SOLUCION no llega al alumnado; lo de ENUNCIADO (comentado) llega sin comentar
    SOLUCION … FIN               deja el hueco vacío
    SOLO SOLUCION                (primera línea) el archivo no se copia
    SOLO ENUNCIADO               (primera línea) el archivo solo existe en la copia del alumnado, sin comentar
  Esta parte solo lee: decide qué va a la copia y qué errores hay. Escribir y comprobar la copia va en --preparar.
*/

// SOLO TS / SOLO JS (primera línea): para proyectos de TypeScript que también se ofrecen en JavaScript (convertir-js.mjs).
// En la copia del alumnado del proyecto TS, un SOLO JS no se copia y un SOLO TS se copia sin la marca.
export const MARKS = ['SOLUCION', 'ENUNCIADO', 'FIN', 'SOLO SOLUCION', 'SOLO ENUNCIADO', 'SOLO TS', 'SOLO JS'];
// Comentarios de cada extensión: [apertura, cierre] ('' si es de línea)
const COMMENTS = [
  [['//', ''], ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'mts', 'cts', 'java', 'c', 'cpp', 'cs', 'go', 'kt', 'swift', 'rs', 'php']],
  [['#', ''], ['py', 'sh', 'rb', 'yml', 'yaml', 'toml', 'r']],
  [['--', ''], ['sql', 'lua']],
  [['<!--', '-->'], ['html', 'xml', 'md', 'vue']],
  [['/*', '*/'], ['css', 'scss']],
  [['{/*', '*/}'], ['jsx', 'tsx']], // dentro de JSX
];
export const NOT_COPIED = new Set(['.git', 'node_modules', '.env', 'junit.xml', '__pycache__', '.pytest_cache', '.venv', 'venv']);
const SELF = 'entregar.mjs'; // este script: se copia tal cual, nunca se procesa

/** Comentarios posibles en un archivo según su extensión ([] si no se procesa). */
export const commentsOf = (file) => {
  const ext = file.includes('.') ? file.split('.').pop().toLowerCase() : '';
  return COMMENTS.filter(([, exts]) => exts.includes(ext)).map(([c]) => c);
};

/** Texto de un comentario que ocupa toda la línea, o null si la línea no es (solo) un comentario. */
export function commentText(line, comments) {
  const t = line.trim();
  for (const [open, close] of comments) {
    if (t.startsWith(open) && (!close || (t.endsWith(close) && t.length >= open.length + close.length))) {
      return t.slice(open.length, close ? t.length - close.length : undefined).trim();
    }
  }
  return null;
}

/** La línea sin el comentario (el prefijo y un espacio opcional), con su sangría; null si no está comentada. */
export function uncomment(line, comments) {
  if (!line.trim()) return '';
  const indent = line.match(/^\s*/)[0];
  const rest = line.slice(indent.length).trimEnd();
  for (const [open, close] of comments) {
    if (rest.startsWith(open) && (!close || (rest.endsWith(close) && rest.length >= open.length + close.length))) {
      let inner = rest.slice(open.length, close ? rest.length - close.length : undefined);
      inner = inner.replace(/^ /, '');
      if (close) inner = inner.replace(/ $/, '');
      return inner ? indent + inner : '';
    }
  }
  return null;
}

export const plain = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/\s+/g, ' ');

/**
 * Marca de una línea: { mark } si es una marca bien escrita, { wrong } si parece una mal escrita, o null.
 * ENUNCIADO y FIN mal escritos solo cuentan en archivos con alguna SOLUCION (son palabras normales en un comentario).
 */
export function markOf(line, comments, withSolution) {
  const text = commentText(line, comments);
  if (text === null) return null;
  if (MARKS.includes(text)) return { mark: text };
  const p = plain(text);
  if (MARKS.includes(p) && (p.includes('SOLUCION') || p.startsWith('SOLO') || withSolution)) return { wrong: p };
  return null;
}

/**
 * Qué va a la copia del alumnado desde un archivo de texto.
 * @returns {{out: string|null, marked: boolean, gaps: number, errors: string[]}}
 *   out: el texto de la copia (null: no se copia); marked: si tiene marcas; gaps: bloques SOLUCION
 */
export function studentText(file, text, comments) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const errors = [];
  const err = (i, msg) => errors.push(`${file}:${i + 1}: ${msg}`);
  const withSolution = lines.some((l) => {
    const t = commentText(l, comments);
    return t !== null && plain(t).includes('SOLUCION');
  });
  const first = lines.findIndex((l) => l.trim());
  const firstMark = first >= 0 ? markOf(lines[first], comments, withSolution) : null;

  // Archivo completo
  if (firstMark?.mark === 'SOLO SOLUCION' || firstMark?.mark === 'SOLO JS') return { out: null, marked: true, gaps: 0, errors };
  if (firstMark?.mark === 'SOLO TS') return { out: lines.filter((_, i) => i !== first).join(eol), marked: true, gaps: 0, errors };
  if (firstMark?.mark === 'SOLO ENUNCIADO') {
    const out = lines.slice(first + 1).map((l, k) => {
      const u = uncomment(l, comments);
      if (u === null) err(first + 1 + k, 'en un archivo SOLO ENUNCIADO todas las líneas van comentadas');
      return u ?? l;
    });
    return { out: out.join(eol), marked: true, gaps: 0, errors };
  }

  // Bloques SOLUCION … [ENUNCIADO …] FIN
  const out = [];
  let state = null; // null | 'SOLUCION' | 'ENUNCIADO'
  let start = 0;
  let gaps = 0;
  let marked = false;
  lines.forEach((line, i) => {
    const m = markOf(line, comments, withSolution);
    if (m?.wrong) return err(i, `«${commentText(line, comments)}»: las marcas van en mayúsculas y sin tilde (${m.wrong})`);
    if (m?.mark) {
      marked = true;
      if (m.mark.startsWith('SOLO')) return err(i, `${m.mark} solo vale en la primera línea del archivo`);
      if (m.mark === 'SOLUCION') {
        if (state) return err(i, `SOLUCION dentro de otro bloque (desde la línea ${start + 1}): las marcas no se pueden anidar`);
        state = 'SOLUCION';
        start = i;
        gaps += 1;
        return;
      }
      if (m.mark === 'ENUNCIADO') {
        if (!state) return err(i, 'ENUNCIADO sin SOLUCION antes');
        if (state === 'ENUNCIADO') return err(i, `ENUNCIADO repetido en el bloque de la línea ${start + 1}`);
        state = 'ENUNCIADO';
        return;
      }
      if (!state) return err(i, 'FIN sin SOLUCION antes');
      state = null;
      return;
    }
    if (!state) out.push(line);
    else if (state === 'ENUNCIADO') {
      const u = uncomment(line, comments);
      if (u === null) err(i, 'entre ENUNCIADO y FIN todas las líneas van comentadas (llegan al alumnado sin el comentario)');
      else out.push(u);
    }
  });
  if (state) err(start, 'SOLUCION sin FIN');
  return { out: out.join(eol), marked, gaps, errors };
}

/**
 * La versión con la solución, sin marcas: los bloques SOLUCION se quedan, los ENUNCIADO y las líneas de las marcas
 * desaparecen. Un archivo SOLO ENUNCIADO no existe en ella (null); a SOLO SOLUCION, SOLO TS y SOLO JS se les quita
 * la marca. La usa convertir-js.mjs (supone que las marcas ya se han revisado con studentText).
 */
export function solutionText(text, comments) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const first = lines.findIndex((l) => l.trim());
  const firstMark = first >= 0 ? markOf(lines[first], comments, true)?.mark : null;
  if (firstMark === 'SOLO ENUNCIADO') return null;
  if (firstMark?.startsWith('SOLO')) return lines.filter((_, i) => i !== first).join(eol);
  const out = [];
  let state = null;
  for (const line of lines) {
    const mark = markOf(line, comments, true)?.mark;
    if (mark === 'SOLUCION' || mark === 'ENUNCIADO') state = mark;
    else if (mark === 'FIN') state = null;
    else if (state !== 'ENUNCIADO') out.push(line);
  }
  return out.join(eol);
}

/** Archivos del proyecto que irían a la copia (sin node_modules, .git, ikasbot/, .env…). */
export function projectFiles(dir = '.') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = dir === '.' ? e.name : `${dir}/${e.name}`;
    if (NOT_COPIED.has(e.name) || p === 'ikasbot') return [];
    const isDir = e.isDirectory() || (e.isSymbolicLink() && statSync(p).isDirectory());
    return isDir ? projectFiles(p) : [p];
  });
}

/**
 * Plan de la copia del alumnado: qué archivo va (y con qué contenido) y los errores de las marcas.
 * @returns {{files: {path: string, text: string|null, copy: boolean}[], marked: number, gaps: number, errors: string[]}}
 *   text: contenido nuevo (archivo con marcas); copy: se copia tal cual; ninguno de los dos: no va
 */
export function studentPlan() {
  const plan = { files: [], marked: 0, gaps: 0, errors: [] };
  for (const path of projectFiles()) {
    const comments = path === SELF ? [] : commentsOf(path);
    if (!comments.length) {
      plan.files.push({ path, copy: true });
      continue;
    }
    const bytes = readFileSync(path);
    let text;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      text = null;
    }
    if (text === null || text.includes('\0')) {
      plan.files.push({ path, copy: true }); // binario: byte a byte
      continue;
    }
    const r = studentText(path, text, comments);
    plan.errors.push(...r.errors);
    if (!r.marked) plan.files.push({ path, copy: true });
    else {
      plan.marked += 1;
      plan.gaps += r.gaps;
      if (r.out !== null) plan.files.push({ path, text: r.out });
    }
  }
  return plan;
}

/** Escribe la copia del alumnado en ikasbot/alumnado/ (entera, desde cero), con los permisos de cada archivo. */
export function writeStudentCopy(plan) {
  rmSync('ikasbot/alumnado', { recursive: true, force: true });
  for (const f of plan.files) {
    const dest = `ikasbot/alumnado/${f.path}`;
    mkdirSync(dirname(dest), { recursive: true });
    if (f.copy) copyFileSync(f.path, dest);
    else writeFileSync(dest, f.text);
    chmodSync(dest, statSync(f.path).mode);
  }
}

/** Tests de un junit: nombre («describe > test») y si ha pasado. */
export function junitCases(xml) {
  const decode = (s) =>
    s.replace(/&(lt|gt|quot|apos|amp);/g, (m, e) => ({ lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' })[e]).replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)));
  return [...xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)].map(([, attrs, inner = '']) => ({
    name: decode(/\bname="([^"]*)"/.exec(attrs)?.[1] ?? ''),
    passed: !/<(failure|error|skipped)\b/.test(inner),
    message: decode(/<(?:failure|error)\b[^>]*\bmessage="([^"]*)"/.exec(inner)?.[1] ?? ''),
  }));
}

/* ---------- El script: entregar (alumnado) y --preparar / --huellas (profesorado) ----------
  Todo va dentro de main(): así otros scripts (convertir-js.mjs) pueden importar las funciones de las marcas
  sin que se ejecute nada. Al lanzarlo (node entregar.mjs …) es como siempre.
*/

const isMain = !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) await main();

async function main() {
  // 1. Configuración: ikasbot.json (del proyecto) y .env (tuyo)
  const preparing = process.argv[2] === '--preparar';
  let config = {};
  if (existsSync('ikasbot.json')) {
    try {
      config = JSON.parse(readFileSync('ikasbot.json', 'utf8'));
    } catch (e) {
      fail(`ikasbot.json no es un JSON válido: ${e.message}`);
    }
  } else if (!preparing) {
    fail('No encuentro ikasbot.json: ejecuta el comando en la carpeta del proyecto.');
  }

  /* ---------- Tareas: las de ikasbot.json y una por carpeta de tests/ ---------- */

  /** Archivos de una carpeta (recursivo), sin node_modules ni carpetas ocultas. */
  function listFiles(dir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      if (e.name.startsWith('.') || e.name === 'node_modules') return [];
      const p = join(dir, e.name);
      return e.isDirectory() ? listFiles(p) : [posix(p)];
    });
  }

  /** Imports relativos de un archivo: import/export … from, import(), require(). Los `import type`, solo en tests de tipos. */
  function importsOf(file) {
    const text = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:\\])\/\/.*$/gm, '$1');
    const withTypes = TYPE_TEST.test(file);
    const specs = [];
    const patterns = [
      /\b(?:import|export)\s+(type\s+)?(?:[^'";]*?\sfrom\s*)?['"]([^'"]+)['"]/g,
      /\bimport\s*\(\s*()['"]([^'"]+)['"]\s*\)/g,
      /\brequire\s*\(\s*()['"]([^'"]+)['"]\s*\)/g,
    ];
    for (const re of patterns) {
      for (const [, isType, spec] of text.matchAll(re)) if (spec.startsWith('.') && (!isType || withTypes)) specs.push(spec);
    }
    return specs.map((spec) => resolveImport(file, spec)).filter(Boolean);
  }

  /** Archivo al que apunta un import relativo (con o sin extensión, .js que en realidad es .ts, o carpeta con index). */
  function resolveImport(from, spec) {
    const base = join(dirname(from), spec);
    const exts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts'];
    const swapped = /\.[cm]?jsx?$/.test(base) ? exts.filter((e) => e.includes('t')).map((e) => base.replace(/\.[cm]?jsx?$/, e)) : [];
    const candidates = [base, ...exts.map((e) => base + e), ...swapped, ...exts.map((e) => join(base, `index${e}`))];
    const found = candidates.find((c) => existsSync(c) && statSync(c).isFile());
    return found ? posix(relative('.', found)) : null;
  }

  /**
   * Tareas a partir de las carpetas de tests/: tests de cada carpeta, el código de src/ que importan (cada archivo,
   * de la primera tarea que lo importa) y el comando de Vitest para los tests de tipos (*.test-d.ts).
   * @returns {{tasks: Map<string, {tests: string[], codigo: string[], others: string[], comando?: string}>, warnings: string[]}}
   *   others: archivos de src/ que importa pero son de una tarea anterior
   */
  function discover() {
    const tasks = new Map();
    const warnings = [];
    if (!existsSync('tests')) return { tasks, warnings };
    const dirs = readdirSync('tests', { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name).sort(byName);
    const owner = new Map();
    for (const code of dirs) {
      if (!TASK_CODE.test(code)) {
        warnings.push(`tests/${code}: el nombre no vale como código de tarea (minúsculas, números, - y _): no es una tarea`);
        continue;
      }
      const tests = listFiles(join('tests', code)).filter((f) => TEST_FILE.test(f)).sort(byName);
      if (!tests.length) {
        warnings.push(`tests/${code} no tiene tests (*.test.js, *.test.ts, *.test-d.ts…)`);
        continue;
      }
      const codigo = [];
      const others = [];
      for (const f of [...new Set(tests.flatMap(importsOf))].filter((f) => f.startsWith('src/'))) {
        if (!owner.has(f)) owner.set(f, code);
        if (owner.get(f) === code) codigo.push(f);
        else others.push(`${f} (${owner.get(f)})`);
      }
      const types = tests.filter((f) => TYPE_TEST.test(f)).length;
      const comando = types === 0 ? undefined : types === tests.length ? VITEST_TYPES : VITEST_BOTH;
      tasks.set(code, { tests, codigo, others, ...(comando && { comando }) });
    }
    return { tasks, warnings };
  }

  /**
   * Las tareas de ikasbot.json con las de las carpetas: lo escrito a mano se respeta (titulo, comando, junit…);
   * a "tests" y "codigo" se añade lo que falte, y se quita lo que ya no existe.
   */
  function mergeTasks(manual, found) {
    const notes = [];
    const keep = (code, list, what) =>
      [].concat(list || []).filter((f) => existsSync(f) || (notes.push(`${code}: ${f} ya no existe: se quita de "${what}"`), false));
    const union = (a, b) => [...new Set([...a, ...b])];
    const out = {};
    const codes = [...Object.keys(manual), ...[...found.keys()].filter((c) => !(c in manual))];
    for (const code of codes) {
      const m = manual[code] || {};
      const f = found.get(code);
      if (!f) {
        out[code] = m;
        continue;
      }
      const next = { titulo: m.titulo ?? code, ...m, tests: union(keep(code, m.tests, 'tests'), f.tests) };
      const codigo = union(keep(code, m.codigo, 'codigo'), f.codigo);
      if (codigo.length) next.codigo = codigo;
      else delete next.codigo;
      // El comando de tipos solo si no hay uno propio (en la tarea o, si no es el de Vitest, en general)
      if (f.comando && !m.comando && (!config.comando || config.comando === VITEST)) next.comando = f.comando;
      out[code] = next;
    }
    return { tareas: out, notes };
  }

  const found = discover();
  const { tareas: tasks, notes } = mergeTasks(config.tareas || {}, found.tasks);
  const testsOf = (t) => [].concat(t.tests || []);

  // Huella de un archivo de test: sha256 del texto sin BOM y con saltos de línea LF (igual en Windows)
  const testHash = (file) => {
    if (!existsSync(file)) fail(`No existe ${file} (está en "tests" de ikasbot.json).`);
    const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    return createHash('sha256').update(text, 'utf8').digest('hex');
  };
  /** Líneas «# tarea» y «huella  ruta». skipMissing: sin parar si falta algún archivo (--preparar ya avisa). */
  const hashLines = (only, { skipMissing = false } = {}) =>
    Object.entries(tasks)
      .filter(([c]) => !only || c === only)
      .flatMap(([c, t]) => [`# ${c}`, ...testsOf(t).filter((f) => !skipMissing || existsSync(f)).map((f) => `${testHash(f)}  ${f}`)]);
  const commandOf = (task) => (task.comando || config.comando || VITEST).replace('{tests}', testsOf(task).map((f) => `"${f}"`).join(' '));
  const junitOf = (task) => task.junit || config.junit || 'junit.xml';

  // Profesorado: huellas de los tests originales, para pegarlas en la tarea de IkasBot
  if (process.argv[2] === '--huellas') {
    const only = process.argv[3];
    if (only && !tasks[only]) fail(`La tarea «${only}» no está en ikasbot.json ni en tests/.`);
    console.log(hashLines(only).join('\n'));
    process.exit(0);
  }

  /* ---------- Profesorado: --preparar ---------- */

  if (preparing) {
    // 0. Marcas: se revisan antes de escribir nada. Con errores, no se genera nada.
    const plan = studentPlan();
    if (plan.errors.length) {
      console.error('✗ Hay errores en las marcas de la copia del alumnado (no se ha generado nada):');
      for (const e of plan.errors) console.error(`  ${e}`);
      process.exit(1);
    }
    const withMarks = plan.marked > 0;

    // 1. ikasbot.json
    const next = { url: config.url ?? 'https://ikasbot.example.com', comando: config.comando ?? VITEST, ...config, tareas: tasks };
    const before = existsSync('ikasbot.json') ? readFileSync('ikasbot.json', 'utf8') : '';
    const after = `${JSON.stringify(next, null, 2)}\n`;
    if (after !== before) writeFileSync('ikasbot.json', after);
    console.log(after === before ? '· ikasbot.json: sin cambios' : `· ikasbot.json ${before ? 'actualizado' : 'creado'}`);
    config = next;

    // ikasbot/ es solo del profesorado: fuera del repositorio del alumnado
    const ignore = existsSync('.gitignore') ? readFileSync('.gitignore', 'utf8') : '';
    if (!/^\/?ikasbot\/?\s*$/m.test(ignore)) {
      writeFileSync('.gitignore', `${ignore}${ignore && !ignore.endsWith('\n') ? '\n' : ''}# Solo para el profesorado (npm run entregar -- --preparar)\nikasbot/\n`);
      console.log('· .gitignore: añadido ikasbot/');
    }

    // 2. Un junit por tarea, ejecutando sus tests (en la versión con la solución deben pasar todos).
    // Sin la copia anterior del alumnado: Vitest filtra por ruta y también ejecutaría sus tests.
    rmSync('ikasbot/alumnado', { recursive: true, force: true });
    rmSync('ikasbot/junit', { recursive: true, force: true });
    mkdirSync('ikasbot/junit', { recursive: true });
    const rows = [];
    for (const [code, task] of Object.entries(tasks)) {
      const warnings = notes.filter((n) => n.startsWith(`${code}: `)).map((n) => n.slice(code.length + 2));
      const auto = found.tasks.get(code);
      if (auto && !auto.codigo.length && !task.codigo) {
        warnings.push(
          auto.others.length
            ? `lo que importa de src/ es de tareas anteriores: ${auto.others.join(', ')} (si hace falta, añade "codigo" a mano)`
            : 'sus tests no importan ningún archivo de src/ (si la tarea guarda código, añade "codigo" a mano)',
        );
      }
      const missing = testsOf(task).filter((f) => !existsSync(f));
      if (missing.length || !testsOf(task).length) {
        warnings.push(missing.length ? `no existen: ${missing.join(', ')}` : 'no tiene tests');
        rows.push({ code, task, tests: '—', codigo: [].concat(task.codigo || []).length, warnings });
        continue;
      }
      const junit = junitOf(task);
      rmSync(junit, { force: true });
      process.stdout.write(`▶ ${code} … `);
      const run = spawnSync(commandOf(task), { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      if (!existsSync(junit)) {
        console.log('sin junit');
        const output = `${run.stdout || ''}${run.stderr || ''}`.trim().split('\n').slice(-15).join('\n');
        warnings.push(`los tests no han generado ${junit}:\n${output.replace(/^/gm, '      ')}`);
        rows.push({ code, task, tests: '—', codigo: [].concat(task.codigo || []).length, warnings });
        continue;
      }
      const xml = readFileSync(junit, 'utf8');
      copyFileSync(junit, `ikasbot/junit/${code}.xml`);
      rmSync(junit, { force: true });
      const count = (re) => (xml.match(re) || []).length;
      const total = count(/<testcase\b/g);
      const failed = count(/<(failure|error)\b/g);
      const skipped = count(/<skipped\b/g);
      console.log(failed ? `${failed} de ${total} fallan` : `${total} tests`);
      if (failed) warnings.push(`${failed} de ${total} tests fallan: --preparar se ejecuta en la versión con la solución`);
      if (skipped) warnings.push(`${skipped} tests omitidos (skip)`);
      const solved = junitCases(xml);
      const passed = solved.filter((c) => c.passed).length;
      rows.push({ code, task, tests: total, passed, names: solved.map((c) => c.name), codigo: [].concat(task.codigo || []).length, warnings });
    }

    // 3. Copia del alumnado (solo con marcas): se genera y se comprueba ejecutando los tests de cada tarea dentro
    let failedCopy = false;
    if (withMarks) {
      writeStudentCopy(plan);
      for (const r of rows.filter((x) => x.tests !== '—')) {
        const junit = `ikasbot/alumnado/${junitOf(r.task)}`;
        rmSync(junit, { force: true });
        process.stdout.write(`▶ ${r.code} (alumnado) … `);
        const run = spawnSync(commandOf(r.task), { cwd: 'ikasbot/alumnado', shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
        if (!existsSync(junit)) {
          console.log('sin junit');
          const output = `${run.stdout || ''}${run.stderr || ''}`.trim().split('\n').slice(-15).join('\n');
          r.errors = [`el enunciado no arranca: los tests no han generado ${junitOf(r.task)} en la copia del alumnado:\n${output.replace(/^/gm, '      ')}`];
          failedCopy = true;
          continue;
        }
        const cases = junitCases(readFileSync(junit, 'utf8'));
        rmSync(junit, { force: true });
        r.student = { passed: cases.filter((c) => c.passed).length, total: cases.length };
        console.log(`${r.student.passed} de ${r.student.total} pasan`);
        r.errors = [];
        // Tienen que ejecutarse los mismos tests que en la solución: si falta alguno, el enunciado no carga
        // (un esqueleto que no compila o un import de src/ que falla sale como un único test con el nombre del archivo)
        const ran = new Set(cases.map((c) => c.name));
        const missing = r.names.filter((n) => !ran.has(n));
        // Y ningún error ajeno a los tests (en los tests de tipos, un esqueleto que no compila sale como «Unhandled Source Error»)
        const strange = cases.filter((c) => !c.passed && !r.names.includes(c.name));
        if (strange.length) {
          r.errors.push(`en la copia del alumnado hay errores que no son de ningún test: el enunciado no compila o no carga\n      ${strange[0].name}${strange[0].message && !strange[0].name.includes(strange[0].message) ? `: ${strange[0].message}` : ''}`);
          failedCopy = true;
        }
        if (missing.length) {
          const why = cases.find((c) => c.message)?.message;
          const list = missing.slice(0, 3).map((n) => `«${n}»`).join(', ') + (missing.length > 3 ? '…' : '');
          r.errors.push(
            `en la copia del alumnado no se ejecutan ${missing.length} de ${r.tests} tests (${list}): el enunciado no arranca (¿un esqueleto que no compila o un import de src/ que falla?) o le faltan tests${why ? `\n      ${why}` : ''}`,
          );
          failedCopy = true;
        }
        for (const c of cases.filter((x) => x.passed && r.names.includes(x.name))) r.warnings.push(`«${c.name}» pasa sin resolver`);
      }
      // Lo que deja Vitest al ejecutarse (su caché en node_modules/.vite) no es parte de la copia
      rmSync('ikasbot/alumnado/node_modules', { recursive: true, force: true });
    }

    // 4. Huellas: de los tests que recibe el alumnado (con marcas, los de su copia)
    const base = withMarks ? 'ikasbot/alumnado/' : '';
    const lines = Object.entries(tasks).flatMap(([c, t]) => [
      `# ${c}`,
      ...testsOf(t)
        .filter((f) => existsSync(base + f))
        .map((f) => `${testHash(base + f)}  ${f}`),
    ]);
    writeFileSync('ikasbot/huellas.txt', `${lines.join('\n')}\n`);

    // 5. Resumen
    const width = Math.max(5, ...rows.map((r) => r.code.length));
    if (!withMarks) {
      console.log(`\n${'Tarea'.padEnd(width)}  Tests  Código  Avisos`);
      for (const r of rows) {
        console.log(`${r.code.padEnd(width)}  ${String(r.tests).padStart(5)}  ${String(r.codigo).padStart(6)}  ${r.warnings.length ? `⚠ ${r.warnings[0]}` : '✓'}`);
        for (const w of r.warnings.slice(1)) console.log(`${' '.repeat(width + 17)}⚠ ${w}`);
      }
    } else {
      console.log(`\nCopia del alumnado: ikasbot/alumnado/ (${plan.marked === 1 ? '1 archivo' : `${plan.marked} archivos`} con marcas, ${plan.gaps === 1 ? '1 hueco' : `${plan.gaps} huecos`})`);
      console.log(`\n${'Tarea'.padEnd(width)}  Código  Solución  Alumnado  Avisos`);
      for (const r of rows) {
        const sol = r.tests === '—' ? '—' : `${r.passed}/${r.tests}`;
        const st = r.student ? `${r.student.passed}/${r.student.total}` : '—';
        const notes = [...(r.errors || []).map((e) => `✗ ${e}`), ...r.warnings.map((w) => `⚠ ${w}`)];
        console.log(`${r.code.padEnd(width)}  ${String(r.codigo).padStart(6)}  ${sol.padEnd(8)}  ${st.padEnd(8)}  ${notes[0] || '✓'}`);
        for (const n of notes.slice(1)) console.log(`${' '.repeat(width + 30)}${n}`);
      }
    }
    for (const w of found.warnings) console.log(`⚠ ${w}`);
    console.log(`
Para cada tarea, en IkasBot (el código de la tarea tiene que ser el de la carpeta):
  · «Importar tests…» con ikasbot/junit/<tarea>.xml
  · en las huellas de los tests, las líneas de su «# tarea» en ikasbot/huellas.txt
ikasbot/ es solo para ti: está en .gitignore y no va al repositorio del alumnado. ikasbot.json sí.`);
    if (withMarks) console.log('La copia del alumnado está en ikasbot/alumnado/: cópiala a mano a su repositorio.');
    process.exit(rows.some((r) => r.tests === '—') || failedCopy ? 1 : 0);
  }

  /* ---------- Alumnado: probar, vigilar y entregar ----------
    Los tres ejecutan el mismo comando de la tarea: lo que se ve al probar es exactamente lo que se evalúa al entregar.
  */

  const mode = { '--probar': 'probar', '--vigilar': 'vigilar' }[process.argv[2]] || 'entregar';
  const code = mode === 'entregar' ? process.argv[2] : process.argv[3];
  const listTasks = () => {
    console.log('Tareas de este proyecto:');
    for (const [c, t] of Object.entries(tasks)) console.log(`  ${c.padEnd(16)} ${t.titulo && t.titulo !== c ? t.titulo : ''}`);
    if (!Object.keys(tasks).length) console.log('  (ninguna)');
  };
  if (!code || code.startsWith('-')) {
    console.log(`Uso: npm run ${mode} <código-de-la-tarea>\n`);
    listTasks();
    process.exit(code ? 1 : 0);
  }
  const task = tasks[code];
  if (!task) {
    console.error(`\n✗ La tarea «${code}» no está en este proyecto.\n`);
    listTasks();
    process.exit(1);
  }

  /** Ejecuta los tests de la tarea con su comando (el mismo al probar y al entregar) y devuelve el junit que generan. */
  function runTests() {
    for (const f of testsOf(task)) if (!existsSync(f)) fail(`No existe ${f} (está en "tests" de ikasbot.json).`);
    const junit = junitOf(task);
    const command = commandOf(task);
    rmSync(junit, { force: true }); // que nunca se lea un informe de una ejecución anterior
    console.log(`▶ ${command}\n`);
    spawnSync(command, { shell: true, stdio: 'inherit' });
    if (!existsSync(junit)) fail(`Los tests no han generado ${junit}. Revisa el error de arriba.`);
    return junit;
  }

  // Probar: sin .env, sin red y sin git. El junit se borra al leerlo (entregar genera siempre uno nuevo).
  if (mode === 'probar') {
    const junit = runTests();
    const cases = junitCases(readFileSync(junit, 'utf8'));
    rmSync(junit, { force: true });
    const passed = cases.filter((c) => c.passed);
    console.log(`\n${passed.length === cases.length ? '✓' : '✗'} ${code}: ${passed.length}/${cases.length} tests superados (no se ha entregado nada)`);
    for (const c of cases) console.log(`  ${c.passed ? '✓' : '✗'} ${c.name}`);
    console.log(`\nAl entregar se ejecuta esto mismo: npm run entregar ${code}`);
    process.exit(cases.length && passed.length === cases.length ? 0 : 1);
  }

  // Vigilar: el modo watch de Vitest con el mismo comando (sin el junit). Otros runners no lo traen de serie.
  if (mode === 'vigilar') {
    const command = commandOf(task);
    if (!/\bvitest run\b/.test(command)) {
      fail(`La tarea «${code}» no se puede vigilar: su comando no es de Vitest (${command}).\n  Usa npm run probar ${code} cada vez que quieras comprobarla.`);
    }
    const watch = command
      .replace(/\bvitest run\b/, 'vitest watch')
      .replace(/\s--reporter[= ]junit\b/g, '')
      .replace(/\s--outputFile(\.junit)?[= ]\S+/g, '')
      .replace(/\s--reporter[= ]default\b/g, '');
    console.log(`▶ ${watch}\n  Los tests se repiten al guardar. Para salir: q o Ctrl+C. Para entregar: npm run entregar ${code}\n`);
    process.exit(spawnSync(watch, { shell: true, stdio: 'inherit' }).status ?? 0);
  }

  // Entregar
  // El .env nunca debe estar en git: el token es como una contraseña
  if (git('ls-files .env')) {
    fail(
      'Tu archivo .env está subido a git y tu token es visible.\n' +
        '  1. En IkasBot, Perfil → Tokens de API: revoca ese token y crea otro.\n' +
        '  2. Sácalo de git: git rm --cached .env && git commit -m "Quita .env"\n' +
        '  3. Comprueba que .gitignore contiene la línea .env',
    );
  }
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  const token = process.env.IKASBOT_TOKEN;
  const base = (process.env.IKASBOT_URL || config.url || '').replace(/\/$/, '');
  if (!token || !token.startsWith('ikb_')) {
    fail('Falta tu token. Créalo en IkasBot (Perfil → Tokens de API), copia .env.example como .env y pégalo en IKASBOT_TOKEN.');
  }
  if (!/^https?:\/\//.test(base)) fail('Falta la dirección de IkasBot: "url" en ikasbot.json (o IKASBOT_URL en .env).');

  // 2. Ejecuta los tests de la tarea (aunque fallen, se entrega el resultado)
  const testFiles = testsOf(task).map((f) => ({ path: f, hash: testHash(f) }));
  const junit = runTests();

  // 3. Envía el informe, las huellas, el código y el commit
  const form = new FormData();
  form.append('junit', new Blob([readFileSync(junit)], { type: 'application/xml' }), junit);
  form.append('testFiles', JSON.stringify(testFiles));
  for (const f of [].concat(task.codigo || [])) {
    if (!existsSync(f)) fail(`No existe ${f} (está en "codigo" de ikasbot.json).`);
    form.append('code', new Blob([readFileSync(f)], { type: 'text/plain' }), f);
  }
  const commit = git('rev-parse --short HEAD');
  if (commit) form.append('commit', commit);

  const res = await fetch(`${base}/api/tasks/${encodeURIComponent(code)}/submissions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  }).catch((e) => fail(`No se puede conectar con ${base}: ${e.message}`));
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) fail('IkasBot no acepta tu token: puede que esté revocado o que sea de otro curso. Crea otro en Perfil → Tokens de API.');
  if (!res.ok) fail(body.error || `Error ${res.status}`);

  // 4. Resultado
  const d = body.data;
  const pct = (s) => (s == null ? '—' : `${Math.round(s * 100)} %`);
  console.log(`\n✓ Intento ${d.attemptNo} entregado${d.isLate ? ' (fuera de plazo)' : ''}`);
  if (d.result.total != null) console.log(`  Tests: ${d.result.passed}/${d.result.total} · nota ${pct(d.score)}`);
  if (d.result.failed?.length) console.log(`  Sin superar: ${d.result.failed.join(', ')}`);
  for (const w of d.result.warnings || []) console.log(`  ⚠ ${w}`);
  console.log(d.best ? `  Tu mejor intento: #${d.best.attemptNo} (${pct(d.best.score)})` : '  Todavía no tienes ningún intento dentro de plazo.');
}
