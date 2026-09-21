"""
bases.py
--------
Subclasses concretas de Produto (Herança + Polimorfismo).

Cada subclasse representa um formato de base diferente, com um
atributo próprio (também encapsulado) e um peso de penalidade de
acabamento diferente aplicado sobre o score base herdado de Produto.
Isso faz com que a mesma chamada polimórfica
`produto.calcular_compatibilidade(perfil)` produza resultados
diferentes conforme o tipo concreto do objeto, mesmo com a mesma
lógica de score base.
"""

from __future__ import annotations

from produto import PerfilDesejado, Produto, Subtom, Acabamento


class BaseLiquida(Produto):
    """Base líquida tradicional. Possui FPS (fator de proteção solar)."""

    PESO_PENALIDADE_ACABAMENTO = 5

    def __init__(
        self,
        marca: str,
        nome: str,
        preco: float,
        tom: str,
        subtom: Subtom,
        acabamento: Acabamento,
        fps: int,
    ) -> None:
        super().__init__(marca, nome, preco, tom, subtom, acabamento)
        self.fps = fps  # passa pelo setter, que valida

    @property
    def fps(self) -> int:
        return self._fps

    @fps.setter
    def fps(self, valor: int) -> None:
        if valor < 0:
            raise ValueError("fps não pode ser negativo")
        self._fps = valor

    def calcular_compatibilidade(self, perfil_desejado: PerfilDesejado) -> float:
        score_base = self._calcular_score_base(perfil_desejado)
        penalidade = (
            self.PESO_PENALIDADE_ACABAMENTO
            if self.acabamento != perfil_desejado.acabamento
            else 0
        )
        score_final = max(0.0, score_base - penalidade)
        return round(score_final, 1)


class BaseCushion(Produto):
    """Base cushion, aplicada com esponja embutida na embalagem."""

    PESO_PENALIDADE_ACABAMENTO = 15

    def __init__(
        self,
        marca: str,
        nome: str,
        preco: float,
        tom: str,
        subtom: Subtom,
        acabamento: Acabamento,
        numero_esponjas: int,
    ) -> None:
        super().__init__(marca, nome, preco, tom, subtom, acabamento)
        self.numero_esponjas = numero_esponjas  # passa pelo setter, que valida

    @property
    def numero_esponjas(self) -> int:
        return self._numero_esponjas

    @numero_esponjas.setter
    def numero_esponjas(self, valor: int) -> None:
        if valor <= 0:
            raise ValueError("numero_esponjas deve ser maior que zero")
        self._numero_esponjas = valor

    def calcular_compatibilidade(self, perfil_desejado: PerfilDesejado) -> float:
        score_base = self._calcular_score_base(perfil_desejado)
        penalidade = (
            self.PESO_PENALIDADE_ACABAMENTO
            if self.acabamento != perfil_desejado.acabamento
            else 0
        )
        score_final = max(0.0, score_base - penalidade)
        return round(score_final, 1)


class BaseMousse(Produto):
    """Base em textura mousse, com percentual de aeração da fórmula."""

    PESO_PENALIDADE_ACABAMENTO = 10

    def __init__(
        self,
        marca: str,
        nome: str,
        preco: float,
        tom: str,
        subtom: Subtom,
        acabamento: Acabamento,
        percentual_aeracao: float,
    ) -> None:
        super().__init__(marca, nome, preco, tom, subtom, acabamento)
        self.percentual_aeracao = percentual_aeracao  # passa pelo setter, que valida

    @property
    def percentual_aeracao(self) -> float:
        return self._percentual_aeracao

    @percentual_aeracao.setter
    def percentual_aeracao(self, valor: float) -> None:
        if not (0 <= valor <= 100):
            raise ValueError("percentual_aeracao deve estar entre 0 e 100")
        self._percentual_aeracao = valor

    def calcular_compatibilidade(self, perfil_desejado: PerfilDesejado) -> float:
        score_base = self._calcular_score_base(perfil_desejado)
        penalidade = (
            self.PESO_PENALIDADE_ACABAMENTO
            if self.acabamento != perfil_desejado.acabamento
            else 0
        )
        score_final = max(0.0, score_base - penalidade)
        return round(score_final, 1)
