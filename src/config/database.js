const { MongoClient } = require('mongodb');
const { Logger } = require('../utils/logger');

const uri = 'mongodb://localhost:27017';
const dbName = 'entregas_db';

class Database {
    constructor() {
        this.client = new MongoClient(uri);
        this.db = null;
    }

    async connect() {
        if (this.db) return;

        try {
            await this.client.connect();
            this.db = this.client.db(dbName);
        } catch (error) {
            Logger.error('Conectar ao MongoDB', error);
            throw error;
        }
    }

    async disconnect() {
        const estavaConectado = Boolean(this.db);

        try {
            await this.client.close();
            this.db = null;
            // Reinicia a instância do client para permitir novas conexões na mesma instância da classe
            this.client = new MongoClient(uri);
        } catch (error) {
            Logger.error('Desconectar do MongoDB', error);
            throw error;
        }
    }

    getCollection(collectionName) {
        if (!this.db) {
            const error = new Error('Banco de dados não conectado.');
            Logger.error('Obter coleção do MongoDB', error);
            throw error;
        }

        return this.db.collection(collectionName);
    }
}

module.exports = { Database };