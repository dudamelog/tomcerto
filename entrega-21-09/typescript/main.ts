/**
 * Demonstração de POLIMORFISMO: um catálogo com instâncias de diferentes
 * subclasses de Produto é percorrido em um único laço, chamando sempre
 * `produto.calcularCompatibilidade(perfilDesejado)` — sem nenhum `instanceof`
 * ou checagem de tipo. Cada objeto resolve a chamada com sua própria
 * implementação (BaseLiquida, BaseCushion ou BaseMousse).
 */

import { Produto, PerfilDesejado, Subtom, Acabamento } from "./produto";
import { BaseLiquida, BaseCushion, BaseMousse } from "./bases";

const catalogo: Produto[] = [
  new BaseLiquida("Boticario", "Make B. Full Cover", 89.9, "230", Subtom.QUENTE, Acabamento.MATTE, 15),
  new BaseCushion("Eudora", "Glow Cushion", 69.9, "Bege Claro 20", Subtom.NEUTRO, Acabamento.LUMINOSO, 2),
  new BaseMousse("Vult", "Mousse Matte", 34.9, "Bege Medio", Subtom.QUENTE, Acabamento.LUMINOSO, 40),
  new BaseLiquida("Quem disse Berenice", "Base Fiel", 79.9, "Dourado 40", Subtom.OLIVA, Acabamento.NATURAL, 0),
  new BaseCushion("Vult", "Cushion Glow", 54.9, "230", Subtom.QUENTE, Acabamento.ACETINADO, 1),
  new BaseMousse("Boticario", "Mousse Intense", 64.9, "Bege 40", Subtom.FRIO, Acabamento.MATTE, 20),
];

const perfilDesejado: PerfilDesejado = {
  subtom: Subtom.QUENTE,
  acabamento: Acabamento.LUMINOSO,
};

interface ResultadoCompatibilidade {
  produto: Produto;
  percentual: number;
}

// Único laço: cada produto responde polimorficamente ao mesmo método.
const resultados: ResultadoCompatibilidade[] = [];
for (const produto of catalogo) {
  const percentual = produto.calcularCompatibilidade(perfilDesejado);
  resultados.push({ produto, percentual });
}

resultados.sort((a, b) => b.percentual - a.percentual);

console.log(
  `Perfil desejado -> subtom: ${Subtom[perfilDesejado.subtom]}, acabamento: ${perfilDesejado.acabamento}`
);
console.log("-".repeat(60));

for (const { produto, percentual } of resultados) {
  console.log(
    `${produto.marca.padEnd(20)} | ${produto.nome.padEnd(20)} | tom ${produto.tom.padEnd(10)} | ${percentual.toFixed(1)}%`
  );
}
