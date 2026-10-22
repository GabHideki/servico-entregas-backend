const { Database } = require('../config/database');
const { Pedido } = require('../models/Pedido');
const { Logger } = require('../utils/logger');

class PedidoService {
    constructor() {
        this.database = new Database();
        this.collectionName = 'pedidos';
    }

    async executarOperacao(operacao, callback) {
        let erroPrincipal = null;

        try {
            await this.database.connect();
            const collection = this.database.getCollection(this.collectionName);
            return await callback(collection);
        } catch (error) {
            erroPrincipal = error;
            Logger.error(operacao, error);
            throw new Error(`Erro ao ${operacao.toLowerCase()}.`, { cause: error });
        } finally {
            try {
                await this.database.disconnect();
            } catch (disconnectError) {
                Logger.error(`Desconectar após ${operacao.toLowerCase()}`, disconnectError);
                if (!erroPrincipal) {
                    throw new Error('Erro ao encerrar a conexão com o banco de dados.', {
                        cause: disconnectError
                    });
                }
            }
        }
    }

    async listarClientesAuxiliar() {
        return this.executarOperacao('Listar clientes auxiliares', async () => {
            const clientesColl = this.database.getCollection('clientes');
            return clientesColl.find({}).toArray();
        });
    }

    async listarEstabelecimentosAuxiliar() {
        return this.executarOperacao('Listar estabelecimentos auxiliares', async () => {
            const estColl = this.database.getCollection('estabelecimentos');
            return estColl.find({}).toArray();
        });
    }

    async listarProdutosPorEstabelecimentoAuxiliar(estabelecimentoId) {
        if (typeof estabelecimentoId !== 'string' || !/^[1-9]\d*$/.test(estabelecimentoId)) {
            const error = new Error('ID do estabelecimento inválido.');
            Logger.error('Listar produtos auxiliares', error);
            throw error;
        }

        return this.executarOperacao('Listar produtos auxiliares', async () => {
            const prodColl = this.database.getCollection('produtos');
            return prodColl.find({ estabelecimentoId: Number(estabelecimentoId) }).toArray();
        });
    }

    async cadastrarPedido(clienteId, estabelecimentoId, itens) {
        if (typeof clienteId !== 'string' || !/^[1-9]\d*$/.test(clienteId)) {
            const error = new Error('ID do cliente inválido.');
            Logger.error('Validar cadastro de pedido', error);
            throw error;
        }

        if (typeof estabelecimentoId !== 'string' || !/^[1-9]\d*$/.test(estabelecimentoId)) {
            const error = new Error('ID do estabelecimento inválido.');
            Logger.error('Validar cadastro de pedido', error);
            throw error;
        }

        const pedido = new Pedido(
            null,
            Number(clienteId),
            Number(estabelecimentoId),
            itens
        );
        pedido.validar();

        return this.executarOperacao('Cadastrar pedido', async (collection) => {
            const clientes = this.database.getCollection('clientes');
            const clienteExiste = await clientes.findOne({ id: pedido.clienteId });
            if (!clienteExiste) {
                throw new Error('Cliente informado não foi encontrado.');
            }

            const estabelecimentos = this.database.getCollection('estabelecimentos');
            const estabelecimentoExiste = await estabelecimentos.findOne({ id: pedido.estabelecimentoId });
            if (!estabelecimentoExiste) {
                throw new Error('Estabelecimento informado não foi encontrado.');
            }

            const produtosColl = this.database.getCollection('produtos');
            for (const item of pedido.itens) {
                const prod = await produtosColl.findOne({
                    id: item.produtoId,
                    estabelecimentoId: pedido.estabelecimentoId
                });
                if (!prod) {
                    throw new Error(`Produto ID ${item.produtoId} não encontrado para este estabelecimento.`);
                }
                item.nome = prod.nome;
                item.precoUnitario = prod.preco;
                item.subtotal = prod.preco * item.quantidade;
            }

            const total = pedido.itens.reduce((acc, item) => acc + item.subtotal, 0);
            const id = await this.gerarProximoId(collection);

            return collection.insertOne({
                id,
                clienteId: pedido.clienteId,
                estabelecimentoId: pedido.estabelecimentoId,
                itens: pedido.itens,
                total,
                status: pedido.status,
                dataCriacao: pedido.dataCriacao,
                dataAtualizacao: pedido.dataAtualizacao
            });
        });
    }

    async obterPedidoPorId(id) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do pedido inválido.');
            Logger.error('Obter pedido por ID', error);
            throw error;
        }
        return this.executarOperacao('Obter pedido por ID', async (collection) => {
            const pedido = await collection.findOne({ id: Number(id) });
            if (!pedido) {
                throw new Error('Pedido não encontrado.');
            }
            return pedido;
        });
    }

    async listarPedidos() {
        return this.executarOperacao('Listar pedidos', async (collection) => {
            return collection.find({}).toArray();
        });
    }

    async atualizarStatus(id, novoStatus) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do pedido inválido.');
            Logger.error('Atualizar status do pedido', error);
            throw error;
        }

        if (typeof novoStatus !== 'string' || novoStatus.trim() === '') {
            const error = new Error('Status é obrigatório.');
            Logger.error('Atualizar status do pedido', error);
            throw error;
        }

        return this.executarOperacao('Atualizar status do pedido', async (collection) => {
            const resultado = await collection.updateOne(
                { id: Number(id) },
                {
                    $set: {
                        status: novoStatus.trim().toLowerCase(),
                        dataAtualizacao: new Date()
                    }
                }
            );

            if (resultado.matchedCount === 0) {
                throw new Error('Pedido não encontrado.');
            }

            return resultado;
        });
    }

    async deletarPedido(id) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do pedido inválido.');
            Logger.error('Deletar pedido', error);
            throw error;
        }

        return this.executarOperacao('Deletar pedido', async (collection) => {
            const resultado = await collection.deleteOne({ id: Number(id) });

            if (resultado.deletedCount === 0) {
                throw new Error('Pedido não encontrado.');
            }

            return resultado;
        });
    }

    async gerarProximoId(collection) {
        const contadores = this.database.getCollection('contadores');

        const resultado = await contadores.findOneAndUpdate(
            { _id: 'pedidos' },
            { $inc: { sequencia: 1 } },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return resultado.sequencia;
    }
}

module.exports = { PedidoService };