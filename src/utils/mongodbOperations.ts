import { MongoClient, Db, Collection } from 'mongodb';
import 'dotenv/config'


export class mongodbOperations {
    private client: MongoClient;
    private db: Db;
    private collection: Collection;
    private uri: string
    private collectionName: string

    constructor(uri: string, collectionName: string) {
        this.collectionName = collectionName;
        this.uri = uri;
        this.client = new MongoClient(this.uri);
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db('daily_questions');
        this.collection = this.db.collection(this.collectionName);
    }

    async fetch(query: object) {
        return await this.collection.find(query).toArray();
    }

    async insert(document: object) {
        return await this.collection.insertOne(document);
    }

    async close() {
        await this.client.close();
    }
}
