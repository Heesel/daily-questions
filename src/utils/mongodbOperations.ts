import { MongoClient, Db, Collection } from 'mongodb';
import 'dotenv/config'
export default class mongodbOperations {
    private client: MongoClient;
    private db: Db;
    private collection: Collection;
    private collectionName: string

    constructor(collectionName: string) {
        this.collectionName = collectionName;
        //@ts-ignore
        this.client = new MongoClient(process.env.CONNECTION_STRING);
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db(process.env.DB_NAME);
        this.collection = this.db.collection(this.collectionName);
    }

    async get(query: object) {
        return await this.collection.find(query).toArray();
    }

    async getOne(query: object) {
        return await this.collection.findOne(query)
    }

    async insert(document: object) {
        return await this.collection.insertOne(document);
    }

    async update(query: object, document: object) {
        return await this.collection.updateOne(query, { $set: document });
    }
    
    async close() {
        await this.client.close();
    }
}
