# TomCerto — POO em Java

Estudo de caso de Programação Orientada a Objetos para o domínio do TomCerto
(site de shade-matching de bases de maquiagem, inspirado no Findation.com):
modela produtos de diferentes formatos e calcula compatibilidade de tom com
o perfil desejado pelo usuário.

## Como compilar e rodar

Não há Maven/Gradle: é uma pasta simples, compilável só com o JDK.

```bash
javac *.java
java Main          # roda a demonstração (ranking de compatibilidade)
java TesteBases    # roda os testes (test runner caseiro, sem JUnit)
```

## Onde estão os 4 pilares

- **Abstração** — `Produto.java`, classe abstrata com o método abstrato
  `calcularCompatibilidade` (cada subclasse decide como implementar) e o
  método protegido `calcularScoreBase`, reaproveitado por todas elas.
- **Encapsulamento** — `Produto.java`: todos os atributos são `private`,
  acessados por getters/setters; `setPreco` valida preço negativo.
  `BaseLiquida.setFps`, `BaseCushion.setNumeroEsponjas` e
  `BaseMousse.setPercentualAeracao` validam seus próprios limites.
- **Herança** — `BaseLiquida.java`, `BaseCushion.java` e `BaseMousse.java`
  estendem `Produto`, herdando marca/nome/preço/tom/subtom/acabamento e o
  cálculo de score base, acrescentando só o atributo específico de cada
  formato (fps, número de esponjas, percentual de aeração).
- **Polimorfismo** — `Main.java`, laço `for (Produto produto : ranking)`
  chamando `produto.calcularCompatibilidade(perfilDesejado)` sem nenhum
  `instanceof`; `TesteBases.java` também prova isso comparando o
  resultado de `BaseLiquida` e `BaseCushion` para a mesma entrada.
