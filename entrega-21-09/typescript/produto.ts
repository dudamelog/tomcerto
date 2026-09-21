/**
 * Modelo de domínio do TomCerto (inspirado no Findation.com): um site de
 * shade-matching de bases de maquiagem para o mercado brasileiro.
 *
 * Este arquivo concentra a ABSTRAÇÃO e o ENCAPSULAMENTO do domínio: a classe
 * `Produto` define o que é comum a toda base de maquiagem (marca, nome,
 * preço, tom, subtom, acabamento) e delega às subclasses (em bases.ts) a
 * responsabilidade de calcular compatibilidade de acordo com sua própria
 * tecnologia (líquida, cushion, mousse).
 */

/** Posição do subtom na escala usada no cálculo de compatibilidade. */
export enum Subtom {
  FRIO = 0,
  NEUTRO = 1,
  OLIVA = 2,
  QUENTE = 3,
}

export enum Acabamento {
  MATTE = "matte",
  ACETINADO = "acetinado",
  LUMINOSO = "luminoso",
  NATURAL = "natural",
}

/** Perfil que o usuário busca ao procurar uma base compatível. */
export interface PerfilDesejado {
  subtom: Subtom;
  acabamento: Acabamento;
}

/**
 * Classe abstrata que representa qualquer base de maquiagem do catálogo.
 * Não pode ser instanciada diretamente — cada tecnologia de base concreta
 * (líquida, cushion, mousse) fica a cargo das subclasses em bases.ts.
 */
export abstract class Produto {
  #marca: string;
  #nome: string;
  #preco: number = 0;
  #tom: string;
  #subtom: Subtom;
  #acabamento: Acabamento;

  constructor(
    marca: string,
    nome: string,
    preco: number,
    tom: string,
    subtom: Subtom,
    acabamento: Acabamento
  ) {
    this.#marca = marca;
    this.#nome = nome;
    this.#tom = tom;
    this.#subtom = subtom;
    this.#acabamento = acabamento;
    // usa o setter (não o campo privado diretamente) para validar preço
    // negativo já na construção, como acontece em produto.py e Produto.java
    this.preco = preco;
  }

  get marca(): string {
    return this.#marca;
  }

  set marca(valor: string) {
    this.#marca = valor;
  }

  get nome(): string {
    return this.#nome;
  }

  set nome(valor: string) {
    this.#nome = valor;
  }

  get preco(): number {
    return this.#preco;
  }

  set preco(valor: number) {
    if (valor < 0) {
      throw new RangeError("preco nao pode ser negativo");
    }
    this.#preco = valor;
  }

  get tom(): string {
    return this.#tom;
  }

  set tom(valor: string) {
    this.#tom = valor;
  }

  get subtom(): Subtom {
    return this.#subtom;
  }

  set subtom(valor: Subtom) {
    this.#subtom = valor;
  }

  get acabamento(): Acabamento {
    return this.#acabamento;
  }

  set acabamento(valor: Acabamento) {
    this.#acabamento = valor;
  }

  /**
   * Calcula o percentual de compatibilidade (0-100, arredondado a 1 casa
   * decimal) entre este produto e o perfil desejado. Cada subclasse decide
   * como penalizar diferenças além do subtom (ex.: acabamento), de acordo
   * com a tecnologia da base.
   */
  abstract calcularCompatibilidade(perfilDesejado: PerfilDesejado): number;

  /**
   * Score base compartilhado por todas as subclasses, calculado apenas a
   * partir da distância de subtom em relação ao perfil desejado. As
   * subclasses reaproveitam este método e aplicam suas próprias penalidades.
   */
  protected calcularScoreBase(perfilDesejado: PerfilDesejado): number {
    const distanciaSubtom = Math.abs(this.subtom - perfilDesejado.subtom);
    const scoreBase = 100 * (1 - distanciaSubtom / 3);
    return scoreBase;
  }
}
