const fs = require("fs");
const path = require("path");

class Corredores {
    constructor (filePath = path.join(__dirname, "../../corredores.json")){
        this.filePath = filePath;
        this.carregar();
    }

    carregar(){
        try{
            const dados = fs.readFileSync(this.filePath, "utf-8");
            this.dados = JSON.parse(dados);
        } catch (err) {
            console.error("Erro ao carregar os corredores:", err.message);
            this.dados = { corridas: [], corredores: []};
        }
    }

    salvar(){
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.dados, null, 2))
        } catch (err) {
            console.error("Erro ao salvar os corredores:", err.message);
        }
    }

    obterDados(){
        return this.dados;
    }

    obterCorridas(){
        return this.dados.corridas || [];
    }

    obterCorridaPorData(data){
        return this.dados.corridas?.find(a => a.data === data) || null;
    }

    criarCorrida(data){
        const corridaExistente = this.obterCorridaPorData(data);
        if (corridaExistente){
            return null;
        }

        const novaCorrida = {
            data,
            resultados: {}
        };

        if(!this.dados.corridas){
            this.dados.corridas = [];
        }

        this.dados.corridas.push(novaCorrida);
        this.salvar();
        return novaCorrida;
    }

    registrarResultado(matricula, voltas, data) {

        const corrida = this.obterCorridaPorData(data);

        if (!corrida) {
            return false;
        }

        corrida.resultados[matricula].voltas += voltas;

        this.atualizarPosicoes(corrida);

        this.salvar();

        return true;
    }
    
    iniciarCorrida(data) {

        const corrida = this.obterCorridaPorData(data);
        if (!corrida) {
            return false;
        }

        if (this.dados.corredores) {
            this.dados.corredores.forEach(corredor => {

                if (!corrida.resultados) {
                    corrida.resultados = {};
                }
                corrida.resultados[corredor.matricula] = {
                    voltas: 0,
                    posicao: 0
                };

            });
        }

        this.salvar();
        return true;
    }

    atualizarPosicoes(corrida) {

        const lista = Object.entries(corrida.resultados);

        lista.sort((a, b) => {
            return b[1].voltas - a[1].voltas;
        });

        lista.forEach(([matricula, dados], index) => {
            corrida.resultados[matricula].posicao = index + 1;
        });
    }

    deletarCorrida(data) {
        const indice = this.dados.corridas?.findIndex(a => a.data === data);
        if (indice === undefined || indice === -1) {
            return false;
        }

        this.dados.corridas.splice(indice, 1);
        this.salvar();
        return true;
    }

    obterRanking(data) {
        const corrida = this.obterCorridaPorData(data);
        if (!corrida) return [];

        return Object.entries(corrida.resultados)
            .map(([matricula, dados]) => ({
                matricula,
                ...dados
            }))
            .sort((a,b) => a.posicao - b.posicao);
    }
}

module.exports = Corredores;
