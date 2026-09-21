"""
produto.py
-----------
Modelo de domínio do TomCerto (shade-matching de bases de maquiagem).

Este módulo define:
  - Os enums Subtom e Acabamento, que representam vocabulário fechado
    do domínio (o subtom de pele e o tipo de acabamento de uma base).
  - A classe abstrata Produto, que concentra os atributos comuns a
    qualquer produto de maquiagem "com tom" (marca, nome, preço, tom,
    subtom, acabamento) e o contrato de cálculo de compatibilidade.
  - A dataclass PerfilDesejado, que representa o que a usuária está
    buscando (o "tomPele" desejado) ao comparar produtos.

Pilares de POO demonstrados aqui:
  - Abstração: classe abstrata Produto + método abstrato
    calcular_compatibilidade.
  - Encapsulamento: atributos privados (prefixo "_") acessados
    exclusivamente via @property / @<atributo>.setter, com validação.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum


class Subtom(Enum):
    """Subtom de pele, numerado pela posição na escala fria->quente.

    O valor numérico é usado diretamente no cálculo de compatibilidade
    (distância entre subtons). OLIVA é tratado como categoria própria,
    não como uma variação de NEUTRO.
    """

    FRIO = 0
    NEUTRO = 1
    OLIVA = 2
    QUENTE = 3


class Acabamento(Enum):
    """Acabamento final da base na pele."""

    MATTE = "matte"
    ACETINADO = "acetinado"
    LUMINOSO = "luminoso"
    NATURAL = "natural"


@dataclass
class PerfilDesejado:
    """Representa o perfil de tom de pele que a usuária está buscando.

    É o "alvo" contra o qual cada Produto calcula sua compatibilidade.
    """

    subtom: Subtom
    acabamento: Acabamento


class Produto(ABC):
    """Classe abstrata que representa um produto de maquiagem com tom.

    Concentra os atributos encapsulados comuns a qualquer base (marca,
    nome, preço, tom, subtom, acabamento) e define o contrato que toda
    subclasse concreta deve implementar: calcular_compatibilidade.
    """

    def __init__(
        self,
        marca: str,
        nome: str,
        preco: float,
        tom: str,
        subtom: Subtom,
        acabamento: Acabamento,
    ) -> None:
        self._marca = marca
        self._nome = nome
        self.preco = preco  # passa pelo setter, que valida
        self._tom = tom
        self.subtom = subtom  # passa pelo setter, que valida
        self.acabamento = acabamento  # passa pelo setter, que valida

    # -- marca ---------------------------------------------------------
    @property
    def marca(self) -> str:
        return self._marca

    @marca.setter
    def marca(self, valor: str) -> None:
        self._marca = valor

    # -- nome ------------------------------------------------------------
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str) -> None:
        self._nome = valor

    # -- preco -----------------------------------------------------------
    @property
    def preco(self) -> float:
        return self._preco

    @preco.setter
    def preco(self, valor: float) -> None:
        if valor < 0:
            raise ValueError("preco não pode ser negativo")
        self._preco = valor

    # -- tom ---------------------------------------------------------------
    @property
    def tom(self) -> str:
        return self._tom

    @tom.setter
    def tom(self, valor: str) -> None:
        self._tom = valor

    # -- subtom -------------------------------------------------------------
    @property
    def subtom(self) -> Subtom:
        return self._subtom

    @subtom.setter
    def subtom(self, valor: Subtom) -> None:
        if not isinstance(valor, Subtom):
            raise TypeError("subtom deve ser uma instância de Subtom")
        self._subtom = valor

    # -- acabamento -----------------------------------------------------------
    @property
    def acabamento(self) -> Acabamento:
        return self._acabamento

    @acabamento.setter
    def acabamento(self, valor: Acabamento) -> None:
        if not isinstance(valor, Acabamento):
            raise TypeError("acabamento deve ser uma instância de Acabamento")
        self._acabamento = valor

    # -- comportamento ---------------------------------------------------------

    def _calcular_score_base(self, perfil_desejado: PerfilDesejado) -> float:
        """Calcula o score base (0-100) a partir da distância de subtom.

        Reaproveitado por todas as subclasses: mede o quão distante o
        subtom deste produto está do subtom desejado, numa escala de
        0 (FRIO) a 3 (QUENTE), e converte essa distância em percentual.
        """
        distancia_subtom = abs(self.subtom.value - perfil_desejado.subtom.value)
        score_base = 100.0 * (1 - distancia_subtom / 3.0)
        return score_base

    @abstractmethod
    def calcular_compatibilidade(self, perfil_desejado: PerfilDesejado) -> float:
        """Retorna o percentual (0-100, 1 casa decimal) de compatibilidade
        deste produto com o perfil desejado. Cada subclasse implementa sua
        própria penalidade de acabamento (peso distinto por formato de
        produto), caracterizando polimorfismo real.
        """
        raise NotImplementedError
