/**
 * Subclasses concretas de Produto (HERANÇA): cada tecnologia de base tem um
 * atributo próprio e seu próprio peso de penalidade quando o acabamento não
 * bate com o perfil desejado. Todas reaproveitam `calcularScoreBase` da
 * superclasse e implementam `calcularCompatibilidade` de forma independente
 * (POLIMORFISMO — ver main.ts, onde o mesmo laço chama o método sem saber
 * qual subclasse está por trás de cada `Produto`).
 */

import { Produto, PerfilDesejado, Subtom, Acabamento } from "./produto";

function arredondar(valor: number): number {
  return Math.round(valor * 10) / 10;
}

/** Base líquida: penalidade leve de acabamento (tecnologia mais versátil). */
export class BaseLiquida extends Produto {
  static readonly PESO_PENALIDADE_ACABAMENTO = 5;

  #fps: number = 0;

  constructor(
    marca: string,
    nome: string,
    preco: number,
    tom: string,
    subtom: Subtom,
    acabamento: Acabamento,
    fps: number
  ) {
    super(marca, nome, preco, tom, subtom, acabamento);
    this.fps = fps;
  }

  get fps(): number {
    return this.#fps;
  }

  set fps(valor: number) {
    if (valor < 0) {
      throw new RangeError("fps nao pode ser negativo");
    }
    this.#fps = valor;
  }

  calcularCompatibilidade(perfilDesejado: PerfilDesejado): number {
    const scoreBase = this.calcularScoreBase(perfilDesejado);
    const penalidade =
      this.acabamento !== perfilDesejado.acabamento
        ? BaseLiquida.PESO_PENALIDADE_ACABAMENTO
        : 0;
    const scoreFinal = Math.max(0, scoreBase - penalidade);
    return arredondar(scoreFinal);
  }
}

/** Base cushion: penalidade alta de acabamento (tecnologia mais rígida). */
export class BaseCushion extends Produto {
  static readonly PESO_PENALIDADE_ACABAMENTO = 15;

  #numeroEsponjas: number = 1;

  constructor(
    marca: string,
    nome: string,
    preco: number,
    tom: string,
    subtom: Subtom,
    acabamento: Acabamento,
    numeroEsponjas: number
  ) {
    super(marca, nome, preco, tom, subtom, acabamento);
    this.numeroEsponjas = numeroEsponjas;
  }

  get numeroEsponjas(): number {
    return this.#numeroEsponjas;
  }

  set numeroEsponjas(valor: number) {
    if (valor <= 0) {
      throw new RangeError("numeroEsponjas deve ser maior que zero");
    }
    this.#numeroEsponjas = valor;
  }

  calcularCompatibilidade(perfilDesejado: PerfilDesejado): number {
    const scoreBase = this.calcularScoreBase(perfilDesejado);
    const penalidade =
      this.acabamento !== perfilDesejado.acabamento
        ? BaseCushion.PESO_PENALIDADE_ACABAMENTO
        : 0;
    const scoreFinal = Math.max(0, scoreBase - penalidade);
    return arredondar(scoreFinal);
  }
}

/** Base mousse: penalidade intermediária de acabamento. */
export class BaseMousse extends Produto {
  static readonly PESO_PENALIDADE_ACABAMENTO = 10;

  #percentualAeracao: number = 0;

  constructor(
    marca: string,
    nome: string,
    preco: number,
    tom: string,
    subtom: Subtom,
    acabamento: Acabamento,
    percentualAeracao: number
  ) {
    super(marca, nome, preco, tom, subtom, acabamento);
    this.percentualAeracao = percentualAeracao;
  }

  get percentualAeracao(): number {
    return this.#percentualAeracao;
  }

  set percentualAeracao(valor: number) {
    if (valor < 0 || valor > 100) {
      throw new RangeError("percentualAeracao deve estar entre 0 e 100");
    }
    this.#percentualAeracao = valor;
  }

  calcularCompatibilidade(perfilDesejado: PerfilDesejado): number {
    const scoreBase = this.calcularScoreBase(perfilDesejado);
    const penalidade =
      this.acabamento !== perfilDesejado.acabamento
        ? BaseMousse.PESO_PENALIDADE_ACABAMENTO
        : 0;
    const scoreFinal = Math.max(0, scoreBase - penalidade);
    return arredondar(scoreFinal);
  }
}
