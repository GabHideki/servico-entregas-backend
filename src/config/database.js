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
            console.log('Conectado ao MongoDB');
        } catch (error) {
            Logger.error('Conectar ao MongoDB', error);
            throw error;
        }
    }

    async disconnect() {
        const estavaConectado = Boolean(this.db);

        try {
            // Também tenta liberar recursos se connect() falhar parcialmente.
            await this.client.close();
            this.db = null;

            if (estavaConectado) {
                console.log('Desconectado do MongoDB');
            }
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
