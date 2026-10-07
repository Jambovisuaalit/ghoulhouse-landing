import { readFileSync, existsSync } from 'node:fs';
import { createRequire, Module } from 'node:module';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '../..');

// Execute the actual route/component with boundary mocks; no duplicate implementation.
export function loadTs(path, mocks = {}) {
  const cache = new Map();
  const load = (file) => {
    if (cache.has(file)) return cache.get(file).exports;
    const mod = new Module(file);
    cache.set(file, mod);
    mod.require = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      let target = id.startsWith('@/') ? resolve(root, 'src', id.slice(2))
        : id.startsWith('.') ? resolve(dirname(file), id) : null;
      if (target) {
        if (!existsSync(target)) target = ['.ts', '.tsx'].map(ext => target + ext).find(existsSync);
        if (target && /\.tsx?$/.test(target)) return load(target);
      }
      return require(id);
    };
    mod._compile(ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText, file);
    return mod.exports;
  };
  return load(resolve(root, path));
}
