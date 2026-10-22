const { ProdutoService } = require('../services/ProdutoService');

class ProdutoView {
    constructor(readlineInterface) {
        this.produtoService = new ProdutoService();
        // Recebe a interface readline já aberta do menu pai para reutilização
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

    async cadastrarProduto(estabelecimento) {
        try {
            console.log(`\n--- Cadastrando produto para: ${estabelecimento.nome} ---`);
            const nome = await this.perguntar('Digite o nome do produto: ');
            const preco = await this.perguntar('Digite o preço do produto (ex: 29.90): ');
            const descricao = await this.perguntar('Digite a descrição do produto: ');

            await this.produtoService.cadastrarProduto(estabelecimento.id, nome, preco, descricao);
            console.log('Produto cadastrado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async listarProdutos(estabelecimento) {
        try {
            const produtos = await this.produtoService.listarProdutosPorEstabelecimento(estabelecimento.id);

            if (produtos.length === 0) {
                console.log(`Nenhum produto cadastrado para ${estabelecimento.nome}.`);
                return;
            }

            console.log(`\nProdutos do estabelecimento "${estabelecimento.nome}":`);
            for (const produto of produtos) {
                console.log(`ID: ${produto.id}`);
                console.log(`Nome: ${produto.nome}`);
                console.log(`Preço: R$ ${Number(produto.preco).toFixed(2)}`);
                console.log(`Descrição: ${produto.descricao}`);
                console.log('-------------------------');
            }
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async atualizarProduto(estabelecimento) {
        try {
            const id = await this.perguntar('Digite o ID do produto a ser atualizado: ');
            const nome = await this.perguntar('Digite o novo nome: ');
            const preco = await this.perguntar('Digite o novo preço: ');
            const descricao = await this.perguntar('Digite a nova descrição: ');

            await this.produtoService.atualizarProduto(
                id.trim(), 
                estabelecimento.id, 
                nome, 
                preco, 
                descricao
            );
            console.log('Produto atualizado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async deletarProduto(estabelecimento) {
        try {
            const id = await this.perguntar('Digite o ID do produto a ser deletado: ');
            await this.produtoService.deletarProduto(id.trim(), estabelecimento.id);
            console.log('Produto deletado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }
}

module.exports = { ProdutoView };