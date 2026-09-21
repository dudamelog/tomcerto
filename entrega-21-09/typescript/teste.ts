/**
 * Testes usando apenas o módulo nativo node:assert/strict (sem
 * jest/mocha/nenhuma dependência externa). Cobrem:
 *  - cálculo de compatibilidade de cada subclasse (valor esperado calculado
 *    manualmente, comparado com tolerância);
 *  - encapsulamento (setters que validam e lançam erro);
 *  - polimorfismo real (subclasses diferentes, mesmo perfil e mesmo "erro"
 *    de acabamento, retornam percentuais finais diferentes).
 */

import assert from "node:assert/strict";
import { PerfilDesejado, Subtom, Acabamento } from "./produto";
import { BaseLiquida, BaseCushion, BaseMousse } from "./bases";

interface CasoDeTeste {
  descricao: string;
  executar: () => void;
}

const casos: CasoDeTeste[] = [];

function registrar(descricao: string, executar: () => void): void {
  casos.push({ descricao, executar });
}

const TOLERANCIA = 0.01;

function assertPercentual(atual: number, esperado: number): void {
  assert.ok(
    Math.abs(atual - esperado) < TOLERANCIA,
    `esperado ${esperado}, obtido ${atual}`
  );
}

// ---------------------------------------------------------------------------
// Cálculo de compatibilidade (valores conferidos manualmente pela fórmula)
// ---------------------------------------------------------------------------

registrar("BaseLiquida calcula compatibilidade esperada (formula manual)", () => {
  const base = new BaseLiquida(
    "Boticario",
    "Make B. Full Cover",
    89.9,
    "230",
    Subtom.NEUTRO,
    Acabamento.MATTE,
    15
  );
  const perfil: PerfilDesejado = { subtom: Subtom.QUENTE, acabamento: Acabamento.LUMINOSO };
  // distanciaSubtom = |1-3| = 2 -> scoreBase = 100*(1-2/3) = 33.333...
  // acabamento diferente (peso 5) -> 28.333... -> arredondado 28.3
  assertPercentual(base.calcularCompatibilidade(perfil), 28.3);
});

registrar("BaseCushion calcula compatibilidade esperada (formula manual)", () => {
  const base = new BaseCushion(
    "Eudora",
    "Glow Cushion",
    69.9,
    "Bege Medio",
    Subtom.OLIVA,
    Acabamento.NATURAL,
    2
  );
  const perfil: PerfilDesejado = { subtom: Subtom.QUENTE, acabamento: Acabamento.LUMINOSO };
  // distanciaSubtom = |2-3| = 1 -> scoreBase = 100*(1-1/3) = 66.666...
  // acabamento diferente (peso 15) -> 51.666... -> arredondado 51.7
  assertPercentual(base.calcularCompatibilidade(perfil), 51.7);
});

registrar("BaseMousse calcula compatibilidade esperada, com clamp em zero (formula manual)", () => {
  const base = new BaseMousse(
    "Vult",
    "Mousse Matte",
    34.9,
    "Bege 40",
    Subtom.FRIO,
    Acabamento.ACETINADO,
    40
  );
  const perfil: PerfilDesejado = { subtom: Subtom.QUENTE, acabamento: Acabamento.LUMINOSO };
  // distanciaSubtom = |0-3| = 3 -> scoreBase = 100*(1-3/3) = 0
  // acabamento diferente (peso 10) -> max(0, 0-10) = 0
  assertPercentual(base.calcularCompatibilidade(perfil), 0);
});

// ---------------------------------------------------------------------------
// Encapsulamento: setters validam e lançam erro
// ---------------------------------------------------------------------------

registrar("preco negativo lanca erro", () => {
  const base = new BaseLiquida("Boticario", "Base X", 50, "200", Subtom.NEUTRO, Acabamento.MATTE, 10);
  assert.throws(() => {
    base.preco = -10;
  });
});

registrar("fps negativo lanca erro", () => {
  const base = new BaseLiquida("Boticario", "Base X", 50, "200", Subtom.NEUTRO, Acabamento.MATTE, 10);
  assert.throws(() => {
    base.fps = -1;
  });
});

registrar("numeroEsponjas menor ou igual a zero lanca erro", () => {
  const base = new BaseCushion("Eudora", "Cushion X", 60, "200", Subtom.NEUTRO, Acabamento.LUMINOSO, 2);
  assert.throws(() => {
    base.numeroEsponjas = 0;
  });
});

registrar("percentualAeracao fora de 0-100 lanca erro", () => {
  const base = new BaseMousse("Vult", "Mousse X", 30, "200", Subtom.NEUTRO, Acabamento.MATTE, 50);
  assert.throws(() => {
    base.percentualAeracao = 150;
  });
  assert.throws(() => {
    base.percentualAeracao = -1;
  });
});

// ---------------------------------------------------------------------------
// Polimorfismo real: mesmo perfil, mesmo "erro" de acabamento, pesos
// diferentes por subclasse -> percentuais finais diferentes.
// ---------------------------------------------------------------------------

registrar("subclasses diferentes com mesmo erro de acabamento retornam percentuais diferentes", () => {
  const perfil: PerfilDesejado = { subtom: Subtom.QUENTE, acabamento: Acabamento.LUMINOSO };
  const liquida = new BaseLiquida("Boticario", "Base A", 50, "230", Subtom.QUENTE, Acabamento.MATTE, 15);
  const cushion = new BaseCushion("Eudora", "Base B", 60, "230", Subtom.QUENTE, Acabamento.MATTE, 2);

  // Mesmo subtom do perfil (distancia 0, scoreBase 100) e mesmo acabamento
  // "errado" (MATTE em vez de LUMINOSO) -> só o peso de penalidade difere.
  const percentualLiquida = liquida.calcularCompatibilidade(perfil);
  const percentualCushion = cushion.calcularCompatibilidade(perfil);

  assertPercentual(percentualLiquida, 95);
  assertPercentual(percentualCushion, 85);
  assert.notStrictEqual(percentualLiquida, percentualCushion);
});

// ---------------------------------------------------------------------------
// Executor
// ---------------------------------------------------------------------------

let falhas = 0;

for (const caso of casos) {
  try {
    caso.executar();
    console.log(`PASS: ${caso.descricao}`);
  } catch (erro) {
    falhas += 1;
    console.log(`FAIL: ${caso.descricao}`);
    console.log(`  ${(erro as Error).message}`);
  }
}

console.log("-".repeat(60));
console.log(`${casos.length - falhas}/${casos.length} testes passaram`);

if (falhas > 0) {
  process.exit(1);
}
