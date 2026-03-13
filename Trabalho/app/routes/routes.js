const express = require("express");
const path = require("path");

function configurarRotas(app, corridaController, resultadoController) {

    const router = express.Router();

    // ========== Página Inicial (Placar) ==========
    router.get("/", (req, res) =>
        res.sendFile(path.join(__dirname, "../../public/index.html"))
    );

    // ========== Rotas de Corrida ==========

    // criar corrida do dia
    router.post("/nova-corrida",
        (req, res) => corridaController.criarNovaCorrida(req, res)
    );

    // obter dados completos do placar
    router.get("/placar",
        (req, res) => corridaController.obterPlacar(req, res)
    );

    // corrida atual
    router.get("/corrida-atual",
        (req, res) => corridaController.obterCorridaAtual(req, res)
    );

    // listar corridas (view)
    router.get("/corridas",(req, res) => res.sendFile(path.join(__dirname, "../../public/corridas.html")));

    // buscar corrida específica
    router.get("/corridas/:data",
        (req, res) => corridaController.obterCorridaPorData(req, res)
    );

    router.get("/corrida/:data",
        (req, res) => corridaController.obterCorridaPorData(req, res)
    );

    // deletar corrida
    router.delete("/corrida/:data",
        (req, res) => corridaController.deletarCorrida(req, res)
    );

    // ========== Rotas de Resultados ==========

    // registrar volta de corredor
    router.post("/volta",
        (req, res) => resultadoController.registrarVolta(req, res)
    );

    // iniciar corrida (todos com 0 voltas)
    router.post("/iniciar",
        (req, res) => resultadoController.iniciarCorrida(req, res)
    );

    // ========== Rotas de Views ==========

    // painel de controle (admin)
    router.get("/painel",
        (req, res) => res.sendFile(
            path.join(__dirname, "../../public/painel.html")
        )
    );

    // placar websocket (visualização)
    router.get("/placar-ws",
        (req, res) => res.sendFile(
            path.join(__dirname, "../../public/placar-ws.html")
        )
    );

    return router;
}

module.exports = configurarRotas;