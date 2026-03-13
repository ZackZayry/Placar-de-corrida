const WebSocket = require("ws");

class Notificador {

    constructor(wss) {
        this.wss = wss;
    }

    broadcast(payload) {

        console.log("🏁 Atualizando placar...");
        console.log("Clientes conectados:", this.wss.clients.size);

        const mensagem = JSON.stringify(payload);

        this.wss.clients.forEach(client => {

            if (client.readyState === WebSocket.OPEN) {
                client.send(mensagem);
            }

        });
    }
}

module.exports = Notificador;