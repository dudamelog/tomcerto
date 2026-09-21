/**
 * Declarações mínimas de ambiente para rodar em Node.js sem depender do
 * pacote npm "@types/node" (esta entrega não usa gerenciador de pacotes).
 * Cobrem apenas o que main.ts e teste.ts efetivamente usam em tempo de
 * execução: console, process.exit e o módulo nativo node:assert/strict.
 */

declare const console: {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
};

declare const process: {
  exit(code?: number): never;
};

declare module "node:assert/strict" {
  interface Assert {
    (value: unknown, message?: string | Error): asserts value;
    ok(value: unknown, message?: string | Error): asserts value;
    throws(block: () => unknown, message?: string | Error): void;
    strictEqual(actual: unknown, expected: unknown, message?: string | Error): void;
    notStrictEqual(actual: unknown, expected: unknown, message?: string | Error): void;
    equal(actual: unknown, expected: unknown, message?: string | Error): void;
    deepStrictEqual(actual: unknown, expected: unknown, message?: string | Error): void;
  }

  const assert: Assert;
  export default assert;
}
