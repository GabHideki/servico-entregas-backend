const { Database } = require('../config/database');
const { Estabelecimento } = require('../models/Estabelecimento');
const { Logger } = require('../utils/logger');

class EstabelecimentoService {
    constructor() {
        this.database = new Database();
        this.collectionName = 'estabelecimentos';
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
                // Não substitui a exceção original caso a operação já tenha falhado.
                if (!erroPrincipal) {
                    throw new Error('Erro ao encerrar a conexão com o banco de dados.', {
                        cause: disconnectError
                    });
                }
            }
        }
    }

    criarEstabelecimentoValidado(nome, categoria, telefone, endereco, operacao) {
        try {
            const estabelecimento = new Estabelecimento(null, nome, categoria, telefone, endereco);
            estabelecimento.validar();
            return estabelecimento;
        } catch (error) {
            Logger.error(operacao, error);
            throw error;
        }
    }

    async cadastrarEstabelecimento(nome, categoria, telefone, endereco) {
        const estabelecimento = this.criarEstabelecimentoValidado(
            nome, categoria, telefone, endereco, 'Validar cadastro de estabelecimento'
        );

        return this.executarOperacao('Cadastrar Estabelecimento', async (collection) => {
            const id = await this.gerarProximoId(collection);

            return collection.insertOne({
                id,
                nome: estabelecimento.nome.trim(),
                categoria: estabelecimento.categoria.trim(),
                telefone: estabelecimento.telefone.trim(),
                endereco: estabelecimento.endereco.trim()
            });
        });
    }

    async obterEstabelecimentoPorId(id) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do estabelecimento inválido.');
            Logger.error('Obter estabelecimento por ID', error);
            throw error;
        }
        return this.executarOperacao('Obter estabelecimento por ID', async (collection) => {
            const estabelecimento = await collection.findOne({ id: Number(id) });
            if (!estabelecimento) {
                throw new Error('Estabelecimento não encontrado.');
            }
            return estabelecimento;
        });
    }

    async listarEstabelecimentos() {
        return this.executarOperacao('Listar estabelecimentos', async (collection) => {
            return collection.find({}).toArray();
        });
    }

    async atualizarEstabelecimento(id, nome, categoria, telefone, endereco) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do estabelecimento inválido.');
            Logger.error('Atualizar estabelecimento', error);
            throw error;
        }

        const estabelecimento = this.criarEstabelecimentoValidado(
            nome, categoria, telefone, endereco, 'Validar atualização de estabelecimento'
        );

        return this.executarOperacao('Atualizar estabelecimento', async (collection) => {
            const resultado = await collection.updateOne(
                { id: Number(id) },
                {
                    $set: {
                        nome: estabelecimento.nome.trim(),
                        categoria: estabelecimento.categoria.trim(),
                        telefone: estabelecimento.telefone.trim(),
                        endereco: estabelecimento.endereco.trim()
                    }
                }
            );

            if (resultado.matchedCount === 0) {
                throw new Error('Estabelecimento não encontrado.');
            }

            return resultado;
        });
    }

    async deletarEstabelecimento(id) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do estabelecimento inválido.');
            Logger.error('Deletar estabelecimento', error);
            throw error;
        }

        return this.executarOperacao('Deletar estabelecimento', async (collection) => {
            const resultado = await collection.deleteOne({ id: Number(id) });

            if (resultado.deletedCount === 0) {
                throw new Error('Estabelecimento não encontrado.');
            }

            return resultado;
        });
    }

    async gerarProximoId(collection) {
        const contadores = this.database.getCollection('contadores');

        const resultado = await contadores.findOneAndUpdate(
            { _id: 'estabelecimentos' },
            { $inc: { sequencia: 1 } },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return resultado.sequencia;
    }
}

module.exports = { EstabelecimentoService };