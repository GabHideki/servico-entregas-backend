const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

class PrincipalView {
    constructor() {
        this.rl = readline.createInterface({ input, output });
    }

    async perguntar(mensagem) {
        return this.rl.question(mensagem);
    }

    fechar() {
        this.rl.close();
    }

    getReadlineInterface() {
        return this.rl;
    }
}

module.exports = { PrincipalView };