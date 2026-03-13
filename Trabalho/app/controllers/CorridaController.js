class CorridaController {

    constructor(corrida, notificador) {
        this.corrida = corrida;
        this.notificador = notificador;
    }

    // Criar corrida do dia
    criarNovaCorrida(req, res) {
        const data = new Date().toISOString().split("T")[0];
        const novaCorrida = this.corrida.criarCorrida(data);

        if (!novaCorrida) {
            return res.json({ mensagem: "Corrida já criada hoje" });
        }        

        this.notificador.notificar(this.corrida.obterDados());

        res.json({
            mensagem: "Nova corrida criada",
            data
        });
        
    }

    // Obter corrida atual
    obterCorridaAtual(req, res){

        const dados = this.corrida.obterDados();
        const corridaAtual = dados.corridas[dados.corridas.length - 1];

        if(!corridaAtual){
            return res.json({ corridaAtual:null });
        }

        const corredores = dados.corredores.map(c => ({
            id: c.matricula,
            nome: c.nome,
            voltas: corridaAtual.resultados[c.matricula]?.voltas || 0
        }));

        res.json({
            corridaAtual:{
                data: corridaAtual.data,
                corredores
            }
        });
    }

    // Buscar corrida por data
    obterCorridaPorData(req, res) {

        const { data } = req.params;

        const corrida = this.corrida.obterCorridaPorData(data);

        res.json(corrida || null);
    }

    // Listar todas corridas
    obterCorridas(req, res) {
        res.json(this.corrida.obterCorridas());
    }

    // Remover corrida
    deletarCorrida(req, res) {

        const { data } = req.params;

        const sucesso = this.corrida.deletarCorrida(data);
        if (!sucesso) {
            return res.status(404).json({
                erro: "Corrida não encontrada"
            });
        }

        this.notificador.notificar(this.corrida.obterDados());

        res.json({ mensagem: "Corrida removida" });
    }

    // Obter dados completos (placar geral)
    obterPlacar(req, res) {
        res.json(this.corrida.obterDados());
    }
}

module.exports = CorridaController;