const { ObjectId } = require('mongodb');
const { Database } = require('../config/database');
const { Cliente } = require('../models/Cliente');
const { Logger } = require('../utils/logger');

class ClienteService {
    constructor() {
        this.database = new Database();
        this.collectionName = 'clientes';
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

    criarClienteValidado(nome, telefone, email, endereco, operacao) {
        try {
            const cliente = new Cliente(null, nome, telefone, email, endereco);
            cliente.validar();
            return cliente;
        } catch (error) {
            Logger.error(operacao, error);
            throw error;
        }
    }

    async cadastrarCliente(nome, telefone, email, endereco) {
        const cliente = this.criarClienteValidado(
            nome, telefone, email, endereco, 'Validar cadastro de cliente'
        );

        return this.executarOperacao('Cadastrar cliente', async (collection) => {
            const id = await this.gerarProximoId(collection);

            return collection.insertOne({
                id,
                nome: cliente.nome.trim(),
                telefone: cliente.telefone.trim(),
                email: cliente.email.trim(),
                endereco: cliente.endereco.trim()
            });
        });
    }

    async listarClientes() {
        return this.executarOperacao('Listar clientes', async (collection) => {
            return collection.find({}).toArray();
        });
    }

    async atualizarCliente(id, nome, telefone, email, endereco) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do cliente inválido.');
            Logger.error('Atualizar cliente', error);
            throw error;
        }

        const cliente = this.criarClienteValidado(
            nome, telefone, email, endereco, 'Validar atualização de cliente'
        );

        return this.executarOperacao('Atualizar cliente', async (collection) => {
            const resultado = await collection.updateOne(
                { id: Number(id) },
                {
                    $set: {
                        nome: cliente.nome.trim(),
                        telefone: cliente.telefone.trim(),
                        email: cliente.email.trim(),
                        endereco: cliente.endereco.trim()
                    }
                }
            );

            if (resultado.matchedCount === 0) {
                throw new Error('Cliente não encontrado.');
            }

            return resultado;
        });
    }

    async deletarCliente(id) {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
            const error = new Error('ID do cliente inválido.');
            Logger.error('Deletar cliente', error);
            throw error;
        }

        return this.executarOperacao('Deletar cliente', async (collection) => {
            const resultado = await collection.deleteOne({ id: Number(id) });

            if (resultado.deletedCount === 0) {
                throw new Error('Cliente não encontrado.');
            }

            return resultado;
        });
    }

    async gerarProximoId(collection) {
        const contadores = this.database.getCollection('contadores');

        const resultado = await contadores.findOneAndUpdate(
            { _id: 'clientes' },
            { $inc: { sequencia: 1 } },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return resultado.sequencia;
    }
}

module.exports = { ClienteService };