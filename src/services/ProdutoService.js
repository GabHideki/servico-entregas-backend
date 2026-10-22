const { Database } = require('../config/database');
const { Produto } = require('../models/Produto');
const { Logger } = require('../utils/logger');

class ProdutoService {
    constructor() {
        this.database = new Database();
        this.collectionName = 'produtos';
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

    criarProdutoValidado(estabelecimentoId, nome, preco, descricao, operacao) {
        try {
            if (typeof estabelecimentoId !== 'number' || isNaN(estabelecimentoId)) {
                throw new Error('ID do estabelecimento é inválido.');
            }

            const precoNumero = Number(preco);
            const produto = new Produto(null, estabelecimentoId, nome, precoNumero, descricao);
            produto.validar();
            return produto;
        } catch (error) {
            Logger.error(operacao, error);
            throw error;
        }
    }

    async cadastrarProduto(estabelecimentoId, nome, preco, descricao) {
        const produto = this.criarProdutoValidado(
            estabelecimentoId, nome, preco, descricao, 'Validar cadastro de produto'
        );

        return this.executarOperacao('Cadastrar produto', async (collection) => {
            const id = await this.gerarProximoId(collection);

            return collection.insertOne({
                id,
                estabelecimentoId: produto.estabelecimentoId,
                nome: produto.nome.trim(),
                preco: produto.preco,
                descricao: produto.descricao.trim()
            });
        });
    }

    async listarProdutosPorEstabelecimento(estabelecimentoId) {
        return this.executarOperacao('Listar produtos por estabelecimento', async (collection) => {
            return collection.find({ estabelecimentoId: Number(estabelecimentoId) }).toArray();
        });
    }

    async atualizarProduto(id, estabelecimentoId, nome, preco, descricao) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do produto inválido.');
            Logger.error('Atualizar produto', error);
            throw error;
        }

        const produto = this.criarProdutoValidado(
            estabelecimentoId, nome, preco, descricao, 'Validar atualização de produto'
        );

        return this.executarOperacao('Atualizar produto', async (collection) => {
            const resultado = await collection.updateOne(
                { id: Number(id), estabelecimentoId: Number(estabelecimentoId) },
                {
                    $set: {
                        nome: produto.nome.trim(),
                        preco: produto.preco,
                        descricao: produto.descricao.trim()
                    }
                }
            );

            if (resultado.matchedCount === 0) {
                throw new Error('Produto não encontrado para este estabelecimento.');
            }

            return resultado;
        });
    }

    async deletarProduto(id, estabelecimentoId) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do produto inválido.');
            Logger.error('Deletar produto', error);
            throw error;
        }

        return this.executarOperacao('Deletar produto', async (collection) => {
            const resultado = await collection.deleteOne({ 
                id: Number(id), 
                estabelecimentoId: Number(estabelecimentoId) 
            });

            if (resultado.deletedCount === 0) {
                throw new Error('Produto não encontrado para este estabelecimento.');
            }

            return resultado;
        });
    }

    async gerarProximoId(collection) {
        const contadores = this.database.getCollection('contadores');

        const resultado = await contadores.findOneAndUpdate(
            { _id: 'produtos' },
            { $inc: { sequencia: 1 } },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return resultado.sequencia;
    }
}

module.exports = { ProdutoService };