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
        }
        catch (error) {

        }
    }
}