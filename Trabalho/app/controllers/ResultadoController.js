class ResultadoController {

    constructor(corrida, notificador) {
        this.corrida = corrida;
        this.notificador = notificador;
    }

    montarEstadoAtual() {

        const dados = this.corrida.obterDados();
        const corrida = dados.corridas[dados.corridas.length - 1];

        if (!corrida) {
            return { corridaAtual: null };
        }

        const corredores = dados.corredores.map(c => ({
            id: c.matricula,
            nome: c.nome,
            voltas: corrida.resultados[c.matricula]?.voltas || 0
        }));

        return {
            corridaAtual: {
                data: corrida.data,
                corredores
            }
        };
    }

    registrarVolta(req, res) {

        const { matricula, voltas } = req.body;
        const data = new Date().toISOString().split("T")[0];

        const sucesso = this.corrida.registrarResultado(
            matricula,
            voltas,
            data
        );

        if (!sucesso) {
            return res.status(400).json({
                erro: "Crie a corrida primeiro"
            });
        }

        this.notificador.broadcast(this.montarEstadoAtual());

        res.json({ ok: true });
    }

    iniciarCorrida(req, res) {

        const data = new Date().toISOString().split("T")[0];

        const sucesso = this.corrida.iniciarCorrida(data);

        if (!sucesso) {
            return res.status(400).json({
                erro: "Crie a corrida primeiro"
            });
        }

        this.notificador.broadcast(this.montarEstadoAtual());

        res.json({ ok: true });
    }
}

module.exports = ResultadoController;