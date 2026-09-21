"""
main.py
-------
Demonstração de Polimorfismo: uma lista de `Produto` (tipo declarado
na variável), contendo instâncias de três subclasses diferentes
(BaseLiquida, BaseCushion, BaseMousse), é percorrida em um único laço
chamando `produto.calcular_compatibilidade(perfil)` sem nenhuma
checagem de tipo (`isinstance`/`if-else`) — cada objeto executa a sua
própria implementação automaticamente.
"""

from __future__ import annotations

from produto import Acabamento, PerfilDesejado, Produto, Subtom
from bases import BaseCushion, BaseLiquida, BaseMousse


def montar_catalogo() -> list[Produto]:
    """Monta o catálogo de produtos do TomCerto (dados fictícios,
    plausíveis de mercado brasileiro).
    """
    produtos: list[Produto] = [
        BaseLiquida(
            marca="Boticário",
            nome="Make B. Matte",
            preco=89.90,
            tom="NC30",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.MATTE,
            fps=15,
        ),
        BaseCushion(
            marca="Eudora",
            nome="Glow Cushion",
            preco=74.90,
            tom="310",
            subtom=Subtom.OLIVA,
            acabamento=Acabamento.LUMINOSO,
            numero_esponjas=1,
        ),
        BaseMousse(
            marca="Vult",
            nome="Mousse Matte HD",
            preco=39.90,
            tom="04",
            subtom=Subtom.NEUTRO,
            acabamento=Acabamento.MATTE,
            percentual_aeracao=35.0,
        ),
        BaseLiquida(
            marca="Quem disse, Berenice?",
            nome="Base Fluida Luminosa",
            preco=64.90,
            tom="Dourado Claro",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.LUMINOSO,
            fps=20,
        ),
        BaseCushion(
            marca="Vult",
            nome="Cushion Natural Finish",
            preco=54.90,
            tom="03",
            subtom=Subtom.NEUTRO,
            acabamento=Acabamento.NATURAL,
            numero_esponjas=2,
        ),
        BaseMousse(
            marca="Boticário",
            nome="Intense Mousse",
            preco=79.90,
            tom="NC40",
            subtom=Subtom.QUENTE,
            acabamento=Acabamento.ACETINADO,
            percentual_aeracao=50.0,
        ),
    ]
    return produtos


def main() -> None:
    produtos = montar_catalogo()
    perfil_desejado = PerfilDesejado(
        subtom=Subtom.QUENTE,
        acabamento=Acabamento.LUMINOSO,
    )

    resultados: list[tuple[Produto, float]] = []
    for produto in produtos:
        # Chamada polimórfica: cada `produto` executa a implementação de
        # calcular_compatibilidade da SUA própria classe, sem que este
        # laço precise saber (nem perguntar) qual é essa classe.
        compatibilidade = produto.calcular_compatibilidade(perfil_desejado)
        resultados.append((produto, compatibilidade))

    resultados.sort(key=lambda item: item[1], reverse=True)

    print(f"Perfil desejado: subtom={perfil_desejado.subtom.name}, "
          f"acabamento={perfil_desejado.acabamento.value}\n")
    print("Ranking de compatibilidade:")
    for produto, compatibilidade in resultados:
        print(
            f"{produto.marca} {produto.nome} ({produto.tom}): "
            f"{compatibilidade}% de compatibilidade"
        )


if __name__ == "__main__":
    main()
