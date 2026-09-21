# Painel — TomCerto (POO em 3 linguagens)

Dashboard e apresentação de slides que rodam **ao vivo** o código da entrega de
Programação Orientada a Objetos (Abstração, Encapsulamento, Herança e
Polimorfismo) do projeto TomCerto, implementada em Python, Java e TypeScript
(`entrega-21-09/`).

O `server.mjs` expõe uma API local que executa os comandos reais (`demo` e
`testes`) de cada linguagem e devolve o `stdout`/`stderr` capturados, para que
o dashboard (`public/index.html`) e os slides (`public/slides.html`) mostrem a
execução em tempo real durante a apresentação.

## Como iniciar

Requer apenas Node.js instalado — nenhuma dependência precisa ser instalada
(o servidor usa só módulos nativos do Node).

```bash
node painel/server.mjs
```

## Onde acessar

- Painel: http://localhost:4500
- Slides: http://localhost:4500/slides.html

## Avisos

- **TypeScript**: a primeira execução usa `npx -p typescript tsc`, que pode
  precisar baixar o pacote `typescript` da internet na primeira vez (fica em
  cache do npm depois, execuções seguintes são rápidas e offline).
- **Java**: é necessário ter `javac` e `java` no PATH (JDK instalado).
- **Python**: é necessário ter `python3` no PATH.
