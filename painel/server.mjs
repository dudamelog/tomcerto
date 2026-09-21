// Servidor HTTP local (só módulos nativos do Node.js) para o painel de demonstração
// ao vivo da entrega de POO do projeto TomCerto (3 linguagens: python, java, typescript).
//
// Serve os arquivos estáticos de painel/public/ e expõe duas rotas de API:
//   GET  /api/manifest  -> conteúdo de painel/manifest.json
//   POST /api/executar  -> executa demo/testes de uma ou todas as linguagens

import http from "node:http";
import { exec } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORTA = 4500;

// painel/ -> raiz do projeto é o diretório pai
const RAIZ_PROJETO = path.resolve(__dirname, "..");
const DIR_PUBLIC = path.join(__dirname, "public");
const CAMINHO_MANIFEST = path.join(__dirname, "manifest.json");

const TIPOS_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const ETAPAS_VALIDAS = ["demo", "testes", "tudo"];

function carregarManifest() {
  const conteudo = fs.readFileSync(CAMINHO_MANIFEST, "utf-8");
  return JSON.parse(conteudo);
}

function enviarJson(res, statusCode, objeto) {
  const corpo = JSON.stringify(objeto);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Content-Length": Buffer.byteLength(corpo),
  });
  res.end(corpo);
}

function lerCorpoRequisicao(req) {
  return new Promise((resolve, reject) => {
    let dados = "";
    req.on("data", (chunk) => {
      dados += chunk;
      // proteção simples contra corpo gigante
      if (dados.length > 5 * 1024 * 1024) {
        reject(new Error("Corpo da requisição excedeu o limite permitido"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(dados));
    req.on("error", reject);
  });
}

function executarComando(comando, cwd) {
  return new Promise((resolve) => {
    const inicio = Date.now();
    exec(
      comando,
      { cwd, timeout: 60000, maxBuffer: 10 * 1024 * 1024, shell: "/bin/sh" },
      (erro, stdout, stderr) => {
        const duracaoMs = Date.now() - inicio;
        if (erro) {
          resolve({
            sucesso: false,
            codigoSaida: typeof erro.code === "number" ? erro.code : 1,
            duracaoMs,
            stdout: (erro.stdout ?? stdout ?? "").toString(),
            stderr: (erro.stderr ?? stderr ?? erro.message ?? "").toString(),
          });
        } else {
          resolve({
            sucesso: true,
            codigoSaida: 0,
            duracaoMs,
            stdout: (stdout ?? "").toString(),
            stderr: (stderr ?? "").toString(),
          });
        }
      }
    );
  });
}

async function tratarExecutar(req, res) {
  let manifest;
  try {
    manifest = carregarManifest();
  } catch (e) {
    enviarJson(res, 500, { erro: `Falha ao ler manifest.json: ${e.message}` });
    return;
  }

  let corpoTexto;
  try {
    corpoTexto = await lerCorpoRequisicao(req);
  } catch (e) {
    enviarJson(res, 400, { erro: `Falha ao ler corpo da requisição: ${e.message}` });
    return;
  }

  let corpo;
  try {
    corpo = corpoTexto ? JSON.parse(corpoTexto) : {};
  } catch (e) {
    enviarJson(res, 400, { erro: "JSON inválido no corpo da requisição" });
    return;
  }

  const { linguagem, etapa } = corpo ?? {};

  const idsLinguagens = manifest.linguagens.map((l) => l.id);
  const linguagensValidas = [...idsLinguagens, "todas"];

  if (typeof linguagem !== "string" || !linguagensValidas.includes(linguagem)) {
    enviarJson(res, 400, {
      erro: `Campo "linguagem" inválido. Valores aceitos: ${linguagensValidas.join(", ")}`,
    });
    return;
  }

  if (typeof etapa !== "string" || !ETAPAS_VALIDAS.includes(etapa)) {
    enviarJson(res, 400, {
      erro: `Campo "etapa" inválido. Valores aceitos: ${ETAPAS_VALIDAS.join(", ")}`,
    });
    return;
  }

  // monta lista de linguagens (na ordem do manifest)
  const linguagensSelecionadas =
    linguagem === "todas"
      ? manifest.linguagens
      : manifest.linguagens.filter((l) => l.id === linguagem);

  // monta lista de etapas
  const etapasSelecionadas = etapa === "tudo" ? ["demo", "testes"] : [etapa];

  const resultados = [];

  for (const langInfo of linguagensSelecionadas) {
    for (const etapaAtual of etapasSelecionadas) {
      const comando = langInfo.comandos?.[etapaAtual];
      if (!comando) {
        resultados.push({
          linguagem: langInfo.id,
          etapa: etapaAtual,
          comando: null,
          sucesso: false,
          codigoSaida: null,
          duracaoMs: 0,
          stdout: "",
          stderr: `Comando não encontrado no manifest para linguagem="${langInfo.id}" etapa="${etapaAtual}"`,
        });
        continue;
      }

      const cwdAbsoluto = path.join(RAIZ_PROJETO, langInfo.cwd);

      try {
        const resultado = await executarComando(comando, cwdAbsoluto);
        resultados.push({
          linguagem: langInfo.id,
          etapa: etapaAtual,
          comando,
          ...resultado,
        });
      } catch (e) {
        // não deve acontecer (executarComando nunca rejeita), mas por segurança:
        resultados.push({
          linguagem: langInfo.id,
          etapa: etapaAtual,
          comando,
          sucesso: false,
          codigoSaida: null,
          duracaoMs: 0,
          stdout: "",
          stderr: `Erro inesperado ao executar: ${e.message}`,
        });
      }
    }
  }

  enviarJson(res, 200, { resultados });
}

async function servirArquivoEstatico(req, res, urlPath) {
  let caminhoRelativo = urlPath === "/" ? "/index.html" : urlPath;
  // remove querystring, se houver (já tratado antes, mas por segurança)
  caminhoRelativo = decodeURIComponent(caminhoRelativo.split("?")[0]);

  const caminhoResolvido = path.normalize(path.join(DIR_PUBLIC, caminhoRelativo));

  // bloqueia path traversal: o resultado precisa continuar dentro de DIR_PUBLIC
  if (!caminhoResolvido.startsWith(DIR_PUBLIC + path.sep) && caminhoResolvido !== DIR_PUBLIC) {
    enviarJson(res, 403, { erro: "Acesso negado" });
    return;
  }

  try {
    const stat = await fsp.stat(caminhoResolvido);
    if (stat.isDirectory()) {
      enviarJson(res, 404, { erro: "Não encontrado" });
      return;
    }
    const conteudo = await fsp.readFile(caminhoResolvido);
    const ext = path.extname(caminhoResolvido).toLowerCase();
    const tipoMime = TIPOS_MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": tipoMime,
      "Access-Control-Allow-Origin": "*",
      "Content-Length": conteudo.length,
    });
    res.end(conteudo);
  } catch (e) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });
    res.end("Não encontrado");
  }
}

const servidor = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  try {
    const urlObj = new URL(url, `http://localhost:${PORTA}`);
    const pathname = urlObj.pathname;

    if (method === "GET" && pathname === "/api/manifest") {
      try {
        const manifest = carregarManifest();
        enviarJson(res, 200, manifest);
      } catch (e) {
        enviarJson(res, 500, { erro: `Falha ao ler manifest.json: ${e.message}` });
      }
      return;
    }

    if (method === "POST" && pathname === "/api/executar") {
      await tratarExecutar(req, res);
      return;
    }

    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (method === "GET") {
      await servirArquivoEstatico(req, res, pathname);
      return;
    }

    enviarJson(res, 405, { erro: `Método não suportado: ${method}` });
  } catch (e) {
    console.error("Erro inesperado:", e);
    try {
      enviarJson(res, 500, { erro: `Erro inesperado no servidor: ${e.message}` });
    } catch (_) {
      // resposta já pode ter sido enviada
    }
  }
});

servidor.listen(PORTA, () => {
  console.log(`Painel disponível em http://localhost:${PORTA}`);
  console.log(`Slides disponíveis em http://localhost:${PORTA}/slides.html`);
});
