const { EstabelecimentoService } = require('../services/EstabelecimentoService');

class EstabelecimentoView {
    constructor(readlineInterface) {
        this.estabelecimentoService = new EstabelecimentoService();
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

    async cadastrarEstabelecimento() {
        try {
            const nome = await this.perguntar('Digite o nome do estabelecimento: ');
            const categoria = await this.perguntar('Digite a categoria do estabelecimento: ');
            const telefone = await this.perguntar('Digite o telefone do estabelecimento: ');
            const endereco = await this.perguntar('Digite o endereço do estabelecimento: ');

            await this.estabelecimentoService.cadastrarEstabelecimento(nome, categoria, telefone, endereco);
            console.log('Estabelecimento cadastrado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async listarEstabelecimentos() {
        try {
            const estabelecimentos = await this.estabelecimentoService.listarEstabelecimentos();

            if (estabelecimentos.length === 0) {
                console.log('Nenhum estabelecimento encontrado.');
                return;
            }

            console.log('\nEstabelecimentos cadastrados:');
            for (const estabelecimento of estabelecimentos) {
                console.log(`ID: ${estabelecimento.id}`);
                console.log(`Nome: ${estabelecimento.nome}`);
                console.log(`Categoria: ${estabelecimento.categoria}`);
                console.log(`Telefone: ${estabelecimento.telefone}`);
                console.log(`Endereço: ${estabelecimento.endereco}`);
                console.log('-------------------------');
            }
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async atualizarEstabelecimento() {
        try {
            const id = await this.perguntar('Digite o ID do estabelecimento: ');
            const nome = await this.perguntar('Digite o novo nome: ');
            const categoria = await this.perguntar('Digite a nova categoria: ');
            const telefone = await this.perguntar('Digite o novo telefone: ');
            const endereco = await this.perguntar('Digite o novo endereço: ');

            await this.estabelecimentoService.atualizarEstabelecimento(id.trim(), nome, categoria, telefone, endereco);
            console.log('Estabelecimento atualizado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async deletarEstabelecimento() {
        try {
            const id = await this.perguntar('Digite o ID do estabelecimento: ');
            await this.estabelecimentoService.deletarEstabelecimento(id.trim());
            console.log('Estabelecimento deletado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async gerenciarProdutosDoEstabelecimento() {
        try {
            const id = await this.perguntar('Digite o ID do estabelecimento que deseja gerenciar os produtos: ');
            const estabelecimento = await this.estabelecimentoService.obterEstabelecimentoPorId(id.trim());
            
            const { ProdutoMenu } = require('../menu/ProdutoMenu');
            await ProdutoMenu(estabelecimento, this.rl);
        } catch (error) {
            this.mostrarErro(error);
        }
    }
}

module.exports = { EstabelecimentoView };