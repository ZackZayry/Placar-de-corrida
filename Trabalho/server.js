const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

// ========== Imports ==========
const Corredores = require("./app/models/Corredores");
const Notificador = require("./app/utils/Notificador");
const CorridaController = require("./app/controllers/CorridaController");
const ResultadoController = require("./app/controllers/ResultadoController");
const configurarRotas = require("./app/routes/routes");

// ========== Setup ==========
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(express.json());
app.use(express.static("public"));

// ========== Inicializar Componentes ==========
const corrida = new Corredores("corredores.json");
const notificador = new Notificador(wss);
const corridaController = new CorridaController(corrida, notificador);
const resultadoController = new ResultadoController(corrida, notificador);

// ========== WebSocket Connection ==========
wss.on("connection", ws => {
    console.log("Cliente conectado");

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });

    ws.on("error", err => {
        console.log("Erro no WebSocket:", err.message);
    });

    ws.send(JSON.stringify(corrida.obterDados()));
});

// ========== Configurar Rotas ==========
const rotas = configurarRotas(app, corridaController, resultadoController, notificador);
app.use(rotas);

// ========== Iniciar Servidor ==========
server.listen(PORT, () => {
    console.log(`\n Servidor rodando na porta ${PORT}`);
});