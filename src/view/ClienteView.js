const { ClienteService } = require('../services/ClienteService');

class ClienteView {
    constructor(readlineInterface) {
        this.clienteService = new ClienteService();
        this.rl = readlineInterface;
    }

    async perguntar(mensagem) {
        return this.rl.question(mensagem);
    }

    mostrarErro(error) {
        console.error(error.message);
        if (error.cause?.message) {
            console.error('Detalhes:', error.cause.message);
        }
    }

    async cadastrarCliente() {
        try {
            const nome = await this.perguntar('Digite o nome do cliente: ');
            const telefone = await this.perguntar('Digite o telefone do cliente: ');
            const email = await this.perguntar('Digite o email do cliente: ');
            const endereco = await this.perguntar('Digite o endereço do cliente: ');

            await this.clienteService.cadastrarCliente(nome, telefone, email, endereco);
            console.log('Cliente cadastrado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async listarClientes() {
        try {
            const clientes = await this.clienteService.listarClientes();

            if (clientes.length === 0) {
                console.log('Nenhum cliente encontrado.');
                return;
            }

            console.log('\nClientes cadastrados:');
            for (const cliente of clientes) {
                console.log(`ID: ${cliente.id}`);
                console.log(`Nome: ${cliente.nome}`);
                console.log(`Telefone: ${cliente.telefone}`);
                console.log(`Email: ${cliente.email}`);
                console.log(`Endereço: ${cliente.endereco}`);
                console.log('-------------------------');
            }
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async atualizarCliente() {
        try {
            const id = await this.perguntar('Digite o ID do cliente: ');
            const nome = await this.perguntar('Digite o novo nome: ');
            const telefone = await this.perguntar('Digite o novo telefone: ');
            const email = await this.perguntar('Digite o novo email: ');
            const endereco = await this.perguntar('Digite o novo endereço: ');

            await this.clienteService.atualizarCliente(id.trim(), nome, telefone, email, endereco);
            console.log('Cliente atualizado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async deletarCliente() {
        try {
            const id = await this.perguntar('Digite o ID do cliente: ');
            await this.clienteService.deletarCliente(id.trim());
            console.log('Cliente deletado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }
}

module.exports = { ClienteView };