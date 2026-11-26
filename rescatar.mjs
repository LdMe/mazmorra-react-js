#!/usr/bin/env node
/*
  Recupera la solución oficial de una tarea cuando ya ha cerrado su plazo.
  Node 20 o posterior, sin dependencias.

    npm run rescatar <código-de-la-tarea>      p. ej. npm run rescatar react-01

  - Descarga la rama `soluciones` del repositorio del curso (la dirección está en ikasbot.json).
  - Antes de sobrescribir nada, guarda una copia de tus archivos en .rescate/<tarea>-<fecha>/.
  - Solo toca los archivos de esa tarea. Después, revisa los cambios y haz commit.
*/
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REMOTO = 'curso';
const RAMA = 'soluciones';

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};
const git = (cmd, opciones = {}) =>
  execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'pipe'], ...opciones });
const gitOk = (cmd) => {
  try {
    git(cmd);
    return true;
  } catch {
    return false;
  }
};

if (!existsSync('ikasbot.json')) fail('No encuentro ikasbot.json: ejecuta el comando en la carpeta del proyecto.');
const config = JSON.parse(readFileSync('ikasbot.json', 'utf8'));
const tareas = config.tareas || {};

const codigo = process.argv[2];
if (!codigo) {
  console.log('Uso: npm run rescatar <código-de-la-tarea>\n\nTareas de este proyecto:');
  for (const [c, t] of Object.entries(tareas)) console.log(`  ${c.padEnd(16)} ${t.titulo || ''}`);
  process.exit(0);
}
const tarea = tareas[codigo];
if (!tarea) fail(`La tarea «${codigo}» no está en ikasbot.json. Tareas: ${Object.keys(tareas).join(', ')}.`);
if (!config.repositorio) fail('Falta "repositorio" en ikasbot.json. Avisa al profesorado.');
if (!gitOk('rev-parse --is-inside-work-tree')) fail('Esta carpeta no es un repositorio git.');

// 1. Remoto del curso (se añade la primera vez)
if (!gitOk(`remote get-url ${REMOTO}`)) {
  console.log(`▶ Añadiendo el remoto «${REMOTO}»: ${config.repositorio}`);
  git(`remote add ${REMOTO} ${config.repositorio}`);
}

// 2. Descargar la rama de soluciones
console.log(`▶ Descargando ${REMOTO}/${RAMA}...`);
try {
  git(`fetch ${REMOTO} ${RAMA}`);
} catch (e) {
  fail(
    `No se ha podido descargar la rama «${RAMA}» del curso.\n` +
      `  ¿Tienes conexión? ¿Se han publicado ya soluciones?\n  ${String(e.stderr || e.message).trim()}`,
  );
}

// El código de la tarea y sus tests (por si alguien los ha tocado)
const archivos = [...new Set([...[].concat(tarea.codigo || []), ...[].concat(tarea.tests || [])])];
const ref = `${REMOTO}/${RAMA}`;

// La rama de soluciones lleva un .tareas-resueltas.json con las tareas ya publicadas
let publicadas = [];
try {
  publicadas = JSON.parse(git(`show ${ref}:.tareas-resueltas.json`).toString()).resueltas || [];
} catch {
  publicadas = [];
}
if (!publicadas.includes(codigo)) {
  fail(`La solución de ${codigo} todavía no está publicada. Espera a que cierre el plazo.`);
}
const faltan = archivos.filter((a) => !gitOk(`cat-file -e ${ref}:${a}`));
if (faltan.length) fail(`En la rama de soluciones faltan archivos: ${faltan.join(', ')}. Avisa al profesorado.`);

// 3. Copia de seguridad de tus archivos actuales
const fecha = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
const copia = join('.rescate', `${codigo}-${fecha}`);
for (const a of archivos) {
  if (!existsSync(a)) continue;
  mkdirSync(dirname(join(copia, a)), { recursive: true });
  copyFileSync(a, join(copia, a));
}

// 4. Sustituir por la solución
for (const a of archivos) {
  mkdirSync(dirname(a), { recursive: true });
  writeFileSync(a, git(`show ${ref}:${a}`));
}

console.log(`\n✓ Solución de ${codigo} recuperada:`);
for (const a of archivos) console.log(`    ${a}`);
console.log(`\n  Tus versiones anteriores están en ${copia}/`);
console.log('  Compara con `git diff`, mira qué hacía falta y haz commit cuando lo tengas claro.');
