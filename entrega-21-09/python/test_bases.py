"""
test_bases.py
-------------
Testes (unittest, biblioteca padrão) para o modelo de domínio do
TomCerto: cobrem o cálculo de compatibilidade de cada subclasse
(comparado com valores calculados manualmente pela fórmula), as
validações de encapsulamento (setters que lançam erro para valores
inválidos) e uma prova de polimorfismo real (duas subclasses com o
mesmo "erro" de acabamento retornam percentuais finais diferentes,
por causa do peso de penalidade próprio de cada uma).

Rodar com:
    python3 -m unittest test_bases.py -v
"""

from __future__ import annotations

import unittest

from produto import Acabamento, PerfilDesejado, Subtom
from bases import BaseCushion, BaseLiquida, BaseMousse


class TestCalculoCompatibilidade(unittest.TestCase):
    """Compara o retorno de calcular_compatibilidade com valores
    calculados manualmente a partir da fórmula da especificação:

        distancia_subtom = abs(subtom.value - perfil.subtom.value)
        score_base = 100.0 * (1 - distancia_subtom / 3.0)
        score_final = max(0.0, score_base - penalidade_acabamento)
    """

    def setUp(self) -> None:
        self.perfil = PerfilDesejado(
            subtom=Subtom.QUENTE, acabamento=Acabamento.LUMINOSO
        )

    def test_base_liquida_compatibilidade_esperada(self) -> None:
        # subtom NEUTRO(1) vs perfil QUENTE(3): distancia=2
        # score_base = 100 * (1 - 2/3) = 33.333...
        # acabamento MATTE != LUMINOSO -> penalidade 5 (peso da BaseLiquida)
        # score_final = 33.333... - 5 = 28.333... -> 28.3
        base = BaseLiquida(
            marca="Boticário",
            nome="Make B. Matte",
            preco=89.90,
            tom="NC30",
            subtom=Subtom.NEUTRO,
            acabamento=Acabamento.MATTE,
            fps=15,
        )
        self.assertAlmostEqual(base.calcular_compatibilidade(self.perfil), 28.3, places=1)

    def test_base_cushion_compatibilidade_esperada(self) -> None:
        # subtom OLIVA(2) vs perfil QUENTE(3): distancia=1
        # score_base = 100 * (1 - 1/3) = 66.666...
        # acabamento LUMINOSO == LUMINOSO -> penalidade 0
        # score_final = 66.666... -> 66.7
        base = BaseCushion(
            marca="Eudora",
            nome="Glow Cushion",
            preco=74.90,
            tom="310",
            subtom=Subtom.OLIVA,
            acabamento=Acabamento.LUMINOSO,
            numero_esponjas=1,
        )
        self.assertAlmostEqual(base.calcular_compatibilidade(self.perfil), 66.7, places=1)

    def test_base_mousse_compatibilidade_esperada(self) -> None:
        # subtom FRIO(0) vs perfil QUENTE(3): distancia=3
        # score_base = 100 * (1 - 3/3) = 0.0
        # acabamento NATURAL != LUMINOSO -> penalidade 10 (peso da BaseMousse)
        # score_final = max(0.0, 0.0 - 10) = 0.0 (clamp em zero)
        base = BaseMousse(
            marca="Vult",
            nome="Mousse Matte HD",
            preco=39.90,
            tom="04",
            subtom=Subtom.FRIO,
            acabamento=Acabamento.NATURAL,
            percentual_aeracao=35.0,
        )
        self.assertAlmostEqual(base.calcular_compatibilidade(self.perfil), 0.0, places=1)


class TestEncapsulamento(unittest.TestCase):
    """Garante que os setters validam os valores e recusam estados
    inválidos, em vez de deixar o objeto silenciosamente incoerente.
    """

    def test_preco_negativo_levanta_value_error(self) -> None:
        base = BaseLiquida(
            marca="Boticário",
            nome="Make B. Matte",
            preco=89.90,
            tom="NC30",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            fps=15,
        )
        with self.assertRaises(ValueError):
            base.preco = -10.0

    def test_fps_negativo_levanta_erro(self) -> None:
        base = BaseLiquida(
            marca="Boticário",
            nome="Make B. Matte",
            preco=89.90,
            tom="NC30",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            fps=15,
        )
        with self.assertRaises(ValueError):
            base.fps = -1

    def test_numero_esponjas_invalido_levanta_erro(self) -> None:
        base = BaseCushion(
            marca="Eudora",
            nome="Glow Cushion",
            preco=74.90,
            tom="310",
            subtom=Subtom.OLIVA,
            acabamento=Acabamento.LUMINOSO,
            numero_esponjas=1,
        )
        with self.assertRaises(ValueError):
            base.numero_esponjas = 0
        with self.assertRaises(ValueError):
            base.numero_esponjas = -3

    def test_percentual_aeracao_fora_do_intervalo_levanta_erro(self) -> None:
        base = BaseMousse(
            marca="Vult",
            nome="Mousse Matte HD",
            preco=39.90,
            tom="04",
            subtom=Subtom.NEUTRO,
            acabamento=Acabamento.MATTE,
            percentual_aeracao=35.0,
        )
        with self.assertRaises(ValueError):
            base.percentual_aeracao = -0.1
        with self.assertRaises(ValueError):
            base.percentual_aeracao = 100.1

    def test_subtom_com_tipo_invalido_levanta_erro(self) -> None:
        base = BaseLiquida(
            marca="Boticário",
            nome="Make B. Matte",
            preco=89.90,
            tom="NC30",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            fps=15,
        )
        with self.assertRaises(TypeError):
            base.subtom = "quente"  # type: ignore[assignment]


class TestPolimorfismo(unittest.TestCase):
    """Prova que o polimorfismo é real (não só nominal): duas
    subclasses diferentes, com o mesmo perfil desejado e o mesmo grau
    de "erro" de acabamento, retornam percentuais finais diferentes,
    porque cada uma aplica seu próprio peso de penalidade.
    """

    def test_pesos_de_penalidade_distintos_geram_resultados_distintos(self) -> None:
        perfil = PerfilDesejado(subtom=Subtom.QUENTE, acabamento=Acabamento.LUMINOSO)

        # Mesmo subtom do perfil (distancia=0 -> score_base=100.0) e
        # acabamento diferente do perfil nos dois casos.
        base_liquida = BaseLiquida(
            marca="Quem disse, Berenice?",
            nome="Base Fluida",
            preco=64.90,
            tom="Dourado Claro",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            fps=20,
        )
        base_cushion = BaseCushion(
            marca="Vult",
            nome="Cushion Natural Finish",
            preco=54.90,
            tom="03",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            numero_esponjas=2,
        )

        compat_liquida = base_liquida.calcular_compatibilidade(perfil)
        compat_cushion = base_cushion.calcular_compatibilidade(perfil)

        self.assertAlmostEqual(compat_liquida, 95.0, places=1)  # 100 - peso 5
        self.assertAlmostEqual(compat_cushion, 85.0, places=1)  # 100 - peso 15
        self.assertNotEqual(compat_liquida, compat_cushion)


if __name__ == "__main__":
    unittest.main()
