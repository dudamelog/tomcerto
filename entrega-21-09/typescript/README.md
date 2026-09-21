# TomCerto — modelo de domínio (TypeScript)

Estudo de caso de POO (Paradigmas de Linguagens de Programação) baseado no
domínio de um site brasileiro de shade-matching de bases de maquiagem
("TomCerto", inspirado no Findation.com).

## Como compilar e rodar

```bash
# 1. Compilar (usa tsc global se existir; senão, npx tsc pontualmente)
tsc            # ou: npx tsc

# 2. Rodar a demonstração de polimorfismo
node main.js

# 3. Rodar os testes
node teste.js
```

Não há `package.json`/`node_modules` nesta pasta: nenhuma dependência npm é
necessária para compilar ou rodar (apenas TypeScript + Node.js nativos).

## Onde estão os 4 pilares de POO

- **Abstração** — `produto.ts`, classe abstrata `Produto` (método
  `abstract calcularCompatibilidade`): define o contrato comum a toda base
  de maquiagem sem detalhar como cada tecnologia calcula compatibilidade.
- **Encapsulamento** — `produto.ts`, campos privados nativos (`#preco`,
  `#marca`, etc.) com getters/setters (`set preco`, que lança `RangeError`
  se negativo); mesmo padrão em `bases.ts` (`set fps`, `set numeroEsponjas`,
  `set percentualAeracao`).
- **Herança** — `bases.ts`, classes `BaseLiquida`, `BaseCushion` e
  `BaseMousse` estendendo `Produto` e reaproveitando `calcularScoreBase`
  (definido em `Produto`).
- **Polimorfismo** — `main.ts`, laço sobre `Produto[]` chamando
  `produto.calcularCompatibilidade(perfil)` sem nenhum `instanceof`; cada
  subclasse responde com sua própria lógica de penalidade de acabamento
  (pesos 5, 15 e 10 respectivamente).
