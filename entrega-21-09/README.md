# Entrega 21/09 — 4 pilares de POO em 3 linguagens

Modelo de domínio único (Produto/Base de maquiagem), implementado em Python, Java e TypeScript, para deixar claro que o paradigma orientado a objetos é o mesmo — só a sintaxe muda.

## Domínio

- **Abstração**: classe abstrata `Produto`, com atributos comuns (`marca`, `nome`, `preco`, `tom`, `subtom`, `acabamento`) e o método abstrato `calcularCompatibilidade(perfilDesejado)`.
- **Herança**: subclasses `BaseLiquida`, `BaseCushion`, `BaseMousse`, cada uma acrescentando um atributo próprio (`fps`, `numeroEsponjas`, `percentualAeracao`).
- **Polimorfismo**: cada subclasse implementa `calcularCompatibilidade()` retornando um percentual de match (0–100%), com peso de penalidade de acabamento próprio por subclasse (líquida=5, mousse=10, cushion=15). Um mesmo laço percorrendo uma lista de `Produto` chama o método certo para cada tipo, sem `if/else` de tipo.
- **Encapsulamento**: atributos privados (convenção de cada linguagem) acessados só por getters/setters, com validação (ex.: preço não pode ser negativo).

Fórmula de compatibilidade (igual nas 3 linguagens):

```
distanciaSubtom = |posição(subtom_produto) - posição(subtom_desejado)|   // escala: frio=0, neutro=1, oliva=2, quente=3
scoreBase = 100 * (1 - distanciaSubtom / 3)
penalidade = acabamento bate? 0 : peso_da_subclasse
scoreFinal = max(0, scoreBase - penalidade)
```

## Como rodar

Ver o `README.md` de cada pasta (`python/`, `java/`, `typescript/`) para instruções de execução e testes.

## Divisão de tarefas

- Python — Eduarda
- Java — Natalia
- TypeScript — dividir em par, ou quem tiver mais afinidade assume e a outra revisa
- Revisão cruzada — as duas, antes de segunda
