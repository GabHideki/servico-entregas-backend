const { PedidoService } = require('../services/PedidoService');

class PedidoView {
    constructor(readlineInterface) {
        this.pedidoService = new PedidoService();
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

    async cadastrarPedido() {
        try {
            console.log('\n--- CADASTRAR NOVO PEDIDO ---');

            // 1. Escolha do Cliente
            const desejaListarClientes = (await this.perguntar('Deseja listar os clientes cadastrados? (s/n): ')).trim().toLowerCase();
            if (desejaListarClientes === 's' || desejaListarClientes === 'sim') {
                const clientes = await this.pedidoService.listarClientesAuxiliar();
                if (clientes.length === 0) {
                    console.log('Nenhum cliente cadastrado no sistema.');
                } else {
                    console.log('\nClientes disponíveis:');
                    clientes.forEach(c => console.log(`[ID: ${c.id}] Nome: ${c.nome} | Tel: ${c.telefone}`));
                    console.log('-------------------------');
                }
            }
            const clienteId = await this.perguntar('Digite o ID do cliente: ');

            // 2. Escolha do Estabelecimento
            const desejaListarEstab = (await this.perguntar('Deseja listar os estabelecimentos cadastrados? (s/n): ')).trim().toLowerCase();
            if (desejaListarEstab === 's' || desejaListarEstab === 'sim') {
                const estabelecimentos = await this.pedidoService.listarEstabelecimentosAuxiliar();
                if (estabelecimentos.length === 0) {
                    console.log('Nenhum estabelecimento cadastrado no sistema.');
                } else {
                    console.log('\nEstabelecimentos disponíveis:');
                    estabelecimentos.forEach(e => console.log(`[ID: ${e.id}] Nome: ${e.nome} | Categoria: ${e.categoria}`));
                    console.log('-------------------------');
                }
            }
            const estabelecimentoId = await this.perguntar('Digite o ID do estabelecimento: ');

            // 3. Escolha dos Produtos do Estabelecimento
            const produtos = await this.pedidoService.listarProdutosPorEstabelecimentoAuxiliar(estabelecimentoId.trim());
            if (produtos.length === 0) {
                console.log('Aviso: Este estabelecimento não possui produtos cadastrados.');
                return;
            }

            console.log(`\nProdutos disponíveis no estabelecimento (ID ${estabelecimentoId}):`);
            produtos.forEach(p => console.log(`[ID: ${p.id}] ${p.nome} - R$ ${Number(p.preco).toFixed(2)} (${p.descricao})`));
            console.log('-------------------------');

            const itens = [];
            let adicionarMais = true;

            while (adicionarMais) {
                const produtoIdStr = await this.perguntar('Digite o ID do produto que deseja adicionar: ');
                const quantidadeStr = await this.perguntar('Digite a quantidade: ');

                const produtoId = Number(produtoIdStr.trim());
                const quantidade = Number(quantidadeStr.trim());

                if (isNaN(produtoId) || produtoId <= 0) {
                    console.log('ID do produto inválido!');
                    continue;
                }

                if (isNaN(quantidade) || quantidade <= 0) {
                    console.log('Quantidade inválida!');
                    continue;
                }

                itens.push({ produtoId, quantidade });

                const resposta = (await this.perguntar('Deseja adicionar outro produto? (s/n): ')).trim().toLowerCase();
                if (resposta !== 's' && resposta !== 'sim') {
                    adicionarMais = false;
                }
            }

            await this.pedidoService.cadastrarPedido(clienteId.trim(), estabelecimentoId.trim(), itens);
            console.log('\nPedido cadastrado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async listarPedidos() {
        try {
            const pedidos = await this.pedidoService.listarPedidos();

            if (pedidos.length === 0) {
                console.log('Nenhum pedido encontrado.');
                return;
            }

            console.log('\nPedidos cadastrados:');
            for (const pedido of pedidos) {
                console.log(`ID: ${pedido.id}`);
                console.log(`ID Cliente: ${pedido.clienteId}`);
                console.log(`ID Estabelecimento: ${pedido.estabelecimentoId}`);
                console.log(`Status: ${pedido.status}`);
                console.log(`Total: R$ ${Number(pedido.total || 0).toFixed(2)}`);
                console.log(`Data Criação: ${new Date(pedido.dataCriacao).toLocaleString('pt-BR')}`);
                console.log('Itens:');
                for (const item of pedido.itens) {
                    console.log(`  - Prod ID: ${item.produtoId} | ${item.nome || 'Produto'} | Qtd: ${item.quantidade} | Subtotal: R$ ${Number(item.subtotal || 0).toFixed(2)}`);
                }
                console.log('-------------------------');
            }
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async atualizarStatus() {
        try {
            const id = await this.perguntar('Digite o ID do pedido: ');
            console.log('Opções de status: pendente, preparando, enviado, concluido, cancelado');
            const novoStatus = await this.perguntar('Digite o novo status: ');

            await this.pedidoService.atualizarStatus(id.trim(), novoStatus);
            console.log('Status do pedido atualizado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }

    async deletarPedido() {
        try {
            const id = await this.perguntar('Digite o ID do pedido: ');
            await this.pedidoService.deletarPedido(id.trim());
            console.log('Pedido deletado com sucesso!');
        } catch (error) {
            this.mostrarErro(error);
        }
    }
}

module.exports = { PedidoView };