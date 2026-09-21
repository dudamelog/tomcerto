# TomCerto (nome provisório)

Site brasileiro de tradução de tom de base entre marcas — inspirado no [Findation.com](https://findation.com): a pessoa informa os tons de base que já usa e que combinam com sua pele, e o site indica o tom equivalente em outras marcas. TomCerto adapta essa ideia para o mercado nacional (marcas vendidas no Brasil, preços em real, onde comprar aqui), acrescentando subtom, textura, avaliações da comunidade e comparador de produtos.

> **Nome provisório.** "TomCerto" ainda não foi travado como nome definitivo do projeto — é o nome usado desde o rascunho inicial e mantido por consistência no código.

## Contexto e origem

Este repositório nasceu como entrega da disciplina **Paradigmas de Linguagens de Programação** (atividade "Explorar pilares do Paradigma Orientado a Objeto", disciplina CC.P5.447, prazo 21/09/2026), que pedia para expressar os quatro pilares da Programação Orientada a Objetos — **Abstração, Herança, Polimorfismo e Encapsulamento** — em três linguagens distintas.

Em vez de usar um exemplo genérico e descartável, o grupo decidiu usar o domínio de um projeto real (o TomCerto) como estudo de caso: o modelo de classes criado para a entrega de POO foi desenhado para, no futuro, ser reaproveitado como base do backend real do produto — não é código de exercício isolado.

Dois documentos guiaram as decisões deste repositório e continuam na raiz para referência:

- **`PLP - Foundation Match BR (Rascunho + Requisitos) (1).pdf`** — o documento de projeto original: contexto da atividade acadêmica, ideia do produto, documento de requisitos completo (RF01–RF14), requisitos não funcionais, estrutura de diretórios planejada, divisão de tarefas e cronograma.
- **`Pesquisa (1).pdf`** — pesquisa de mercado e técnica sobre sites de shade-matching (Findation, Sephora Color IQ, L'Oréal Match My Shade, Fenty Shade Finder, Perfect Corp/YouCam), terminologia padronizada da indústria (subtom quente/frio/neutro/oliva, acabamento matte/acetinado/luminoso/natural, textura líquida/cremosa/mousse/bastão/pó/cushion), o padrão técnico de shade-matching (CIELAB + Delta-E/CIEDE2000) e a realidade do varejo brasileiro (Beleza na Web, Época Cosméticos, Sephora Brasil, Mercado Livre, Amazon Brasil — nenhum deles filtra por subtom, o que confirma esse como o diferencial do TomCerto).

## Requisitos do produto (resumo)

A partir do PLP, o produto completo (fases futuras, fora do escopo da entrega de POO) cobre:

**Requisitos base, equivalentes ao Findation (RF01–RF06):** cadastro/login, cadastro de tons já usados, motor de compatibilidade entre marcas, catálogo de produtos, busca/filtro, página do produto.

**Melhorias propostas pelo grupo (RF07–RF14):** seleção e quiz de subtom, preferência de textura e de formato/espessura, avaliações da comunidade com disclosure opcional de tom/tipo de pele, onde comprar no Brasil (loja + link + preço), perfil de pele salvo, comparador de produtos.

**Fora de escopo por agora:** integração de pagamento, app mobile nativo.

## Modelo de domínio e os 4 pilares de POO

A entrega de 21/09 implementa o mesmo modelo de domínio em **Python, Java e TypeScript**, dentro de `entrega-21-09/`, para deixar claro que o paradigma orientado a objetos é o mesmo — só a sintaxe muda.

- **Abstração** — classe abstrata `Produto`, com os atributos comuns a qualquer base de maquiagem (`marca`, `nome`, `preco`, `tom`, `subtom`, `acabamento`) e o método abstrato `calcularCompatibilidade(perfilDesejado)`.
- **Herança** — subclasses `BaseLiquida`, `BaseCushion` e `BaseMousse`, cada uma acrescentando um atributo próprio (`fps`, `numeroEsponjas`, `percentualAeracao` respectivamente) e reaproveitando o cálculo de score base da superclasse.
- **Polimorfismo** — cada subclasse implementa `calcularCompatibilidade()` com seu próprio peso de penalidade de acabamento (líquida = 5, mousse = 10, cushion = 15); um único laço percorre uma lista de `Produto` chamando o método certo para cada tipo, sem nenhum `if/else`/`instanceof`/`isinstance` checando o tipo.
- **Encapsulamento** — todos os atributos são privados (convenção de cada linguagem: `_atributo` + `@property` em Python, `private` + getters/setters em Java, campos `#privado` nativos em TypeScript), acessados só por getters/setters que validam invariantes (ex.: preço não pode ser negativo).

O vocabulário usado (subtom `FRIO/NEUTRO/OLIVA/QUENTE`, acabamento `MATTE/ACETINADO/LUMINOSO/NATURAL`) segue exatamente os termos padronizados encontrados na pesquisa de mercado, para que o código já nasça alinhado ao domínio real do produto.

### Fórmula de compatibilidade

Simplificação didática do conceito de distância de cor (CIELAB + Delta-E) documentado na pesquisa, adaptada para uma entrega de POO sem exigir um color-space completo:

```
distanciaSubtom = |posição(subtom_produto) − posição(subtom_desejado)|   // escala: frio=0, neutro=1, oliva=2, quente=3
scoreBase        = 100 × (1 − distanciaSubtom / 3)
penalidade       = acabamento bate? 0 : peso_da_subclasse                 // líquida=5, mousse=10, cushion=15
scoreFinal       = max(0, scoreBase − penalidade)                        // percentual de 0 a 100
```

A lógica de distância de subtom é compartilhada (método protegido `calcularScoreBase`/`_calcular_score_base`, herdado por todas as subclasses); a penalidade de acabamento é onde cada subclasse difere — é a prova concreta de polimorfismo, não só nominal.

## Estrutura do repositório

```
README.md                                     # este arquivo
PLP - Foundation Match BR (Rascunho + ...).pdf  # documento de requisitos original
Pesquisa (1).pdf                               # pesquisa de mercado/técnica

entrega-21-09/            # entrega da disciplina de PLP — os 4 pilares em 3 linguagens
├── README.md               # visão geral do domínio e divisão de tarefas
├── python/                 # Eduarda
│   ├── produto.py            # Abstração + Encapsulamento (Produto, enums, PerfilDesejado)
│   ├── bases.py               # Herança + Polimorfismo (BaseLiquida/BaseCushion/BaseMousse)
│   ├── main.py                 # demonstração: ranking de compatibilidade
│   ├── test_bases.py            # testes automatizados (unittest, 9 casos)
│   └── README.md
├── java/                   # Natalia
│   ├── Produto.java, Subtom.java, Acabamento.java, PerfilDesejado.java
│   ├── BaseLiquida.java, BaseCushion.java, BaseMousse.java
│   ├── Main.java                # demonstração: ranking de compatibilidade
│   ├── TesteBases.java           # testes automatizados (test runner caseiro, 15 casos)
│   └── README.md
└── typescript/             # dividido em par
    ├── produto.ts, bases.ts
    ├── main.ts                   # demonstração: ranking de compatibilidade
    ├── teste.ts                   # testes automatizados (node:assert/strict, 8 casos)
    ├── tsconfig.json
    └── README.md

painel/                    # painel local — faz as vezes de "front" enquanto não há um real
├── README.md
├── server.mjs               # servidor HTTP nativo (Node, sem dependências), porta 4500
├── manifest.json             # fonte única dos comandos e do mapeamento de pilares por linguagem
└── public/
    ├── index.html              # dashboard: roda demo/testes das 3 linguagens e mostra o output real
    ├── estilo.css, painel.js
    └── slides.html              # apresentação da entrega, com execução ao vivo embutida
```

## Como rodar cada linguagem

```bash
# Python (requer python3)
cd entrega-21-09/python
python3 main.py
python3 -m unittest test_bases.py -v

# Java (requer JDK — javac/java no PATH; sem Maven/Gradle)
cd entrega-21-09/java
javac *.java
java Main
java TesteBases

# TypeScript (requer Node.js; tsc via npx na primeira vez, sem npm install)
cd entrega-21-09/typescript
npx --yes -p typescript tsc
node main.js
node teste.js
```

Todos os testes das 3 linguagens passam 100% (Python 9/9, Java 15/15, TypeScript 8/8), cobrindo: o cálculo de compatibilidade de cada subclasse contra um valor esperado calculado manualmente, a validação de encapsulamento (rejeição de preço/atributos inválidos) e a prova de que duas subclasses com a mesma distância de subtom retornam percentuais finais diferentes (polimorfismo real).

## Painel local (dashboard + slides)

Como o produto ainda não tem um frontend real, foi criado um painel local que roda os três programas sob demanda e mostra o resultado ao vivo — usado tanto para desenvolvimento quanto para a apresentação em sala.

```bash
node painel/server.mjs
```

- **Dashboard** — `http://localhost:4500`: um cartão por linguagem, mostrando os comandos, onde cada pilar aparece no código, e botões para rodar a demonstração e os testes, com a saída real exibida em estilo terminal.
- **Slides** — `http://localhost:4500/slides.html`: apresentação em HTML (10 slides, navegação por teclado) com trechos de código reais das 3 linguagens lado a lado por pilar, a fórmula de compatibilidade, e um slide de execução ao vivo que roda os três programas e mostra a saída, consumindo o mesmo servidor.

Design minimalista em bege/branco/dourado, sem nenhuma dependência de CDN ou biblioteca externa — funciona **totalmente offline**, para não depender de wifi durante a apresentação. Ver `painel/README.md` para pré-requisitos e avisos (a primeira compilação do TypeScript via `npx` pode precisar de internet).

## Roadmap pós-entrega

O roadmap de expansão (documentado no PLP) foi cruzado com as fases recomendadas pela pesquisa de mercado:

1. **MVP web** (RF01–RF06) — motor de compatibilidade estilo Findation (Lab*/CIEDE2000 se houver dados reais, senão fallback categórico como o desta entrega) + catálogo pequeno digitado à mão.
2. **Subtom e quiz** (RF07/RF08) — quiz de 5–6 perguntas (veia, joia, reação ao sol, tecido, lábio) para descobrir o subtom.
3. **Textura, formato e perfil salvo** (RF09/RF10/RF13).
4. **Onde comprar no Brasil** (RF12) — diretório de links por enquanto, já que nenhum varejista nacional expõe API/scraping confirmado.
5. **Comparador de produtos** (RF14).
6. **Avaliações com disclosure** (RF11) — reviews expondo tom/subtom/tipo de pele de quem avaliou, seguindo o padrão Sephora/Bazaarvoice.
7. **Comunidade, parcerias/monetização e app mobile** — fases finais, sem mudanças em relação ao plano original do PLP.

Decisões ainda em aberto (não bloqueiam o roadmap, mas precisam ser fechadas antes do MVP): nome definitivo do projeto, fonte de dados de preço/loja (catálogo manual vs. scraping/API), stack técnica do backend/frontend real, e política de moderação das avaliações da comunidade.

## Divisão de tarefas (entrega 21/09)

| Tarefa | Responsável |
|---|---|
| Python — `Produto`, `Base*`, `main.py` + README | Eduarda |
| Java — `Produto`, `Base*`, `Main.java` + README | Natalia |
| TypeScript — implementação + README | Dividido em par |
| Revisão cruzada | As duas, antes da apresentação |
