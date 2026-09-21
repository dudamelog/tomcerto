# TomCerto — Estudo de Caso POO (Python)

Modelo de domínio de shade-matching de bases de maquiagem (inspirado no
Findation.com), usado para demonstrar os 4 pilares de POO com código que
será reaproveitado no backend real do TomCerto.

## Como rodar

```bash
python3 main.py
python3 -m unittest test_bases.py -v
```

## Onde cada pilar aparece

| Pilar | Onde |
|---|---|
| **Abstração** | `produto.py` — classe `Produto(ABC)` e método abstrato `calcular_compatibilidade` |
| **Encapsulamento** | `produto.py` — atributos privados `_preco`, `_subtom`, `_acabamento` com `@property`/setters validando (`ValueError`/`TypeError`); mesmo padrão em `bases.py` para `_fps`, `_numero_esponjas`, `_percentual_aeracao` |
| **Herança** | `bases.py` — `BaseLiquida`, `BaseCushion`, `BaseMousse` herdam de `Produto` e reaproveitam `_calcular_score_base` |
| **Polimorfismo** | `main.py` — laço único chamando `produto.calcular_compatibilidade(perfil)` sobre `list[Produto]`, sem `isinstance`; cada subclasse aplica seu próprio peso de penalidade (5 / 15 / 10), comprovado em `test_bases.py::TestPolimorfismo` |

## Arquivos

- `produto.py` — enums `Subtom`/`Acabamento`, `PerfilDesejado`, classe abstrata `Produto`.
- `bases.py` — subclasses `BaseLiquida`, `BaseCushion`, `BaseMousse`.
- `main.py` — catálogo de exemplo, ranking de compatibilidade impresso.
- `test_bases.py` — testes `unittest` (fórmula, encapsulamento, polimorfismo).
