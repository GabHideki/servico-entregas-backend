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
        try{
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log('Connected to MongoDB');
        }
        catch (error) {
            Logger.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.client.close();
            this.db = null;
            console.log('Disconnected from MongoDB');
        }
        catch (error) {
            Logger.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    getCollection(collectionName) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return this.db.collection(collectionName);
    }
}

module.exports = { Database };