import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://zainabsarwar58:zainab984@cluster0.zjkfo.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'mydatabase';
const COLLECTION_NAME = 'leads';

let client = null;
let db = null;

// Connect to MongoDB
export const connectDB = async () => {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db(DB_NAME);
            console.log('✅ Connected to MongoDB successfully');
        }
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

// Get database instance
export const getDB = async () => {
    if (!db) {
        await connectDB();
    }
    return db;
};

// Get collection
export const getCollection = async (collectionName = COLLECTION_NAME) => {
    const database = await getDB();
    return database.collection(collectionName);
};

// Close MongoDB connection
export const disconnectDB = async () => {
    try {
        if (client) {
            await client.close();
            client = null;
            db = null;
            console.log('✅ MongoDB connection closed');
        }
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
    }
};

// Get connection status
export const getConnectionStatus = () => {
    return {
        isConnected: client !== null && client.topology?.isConnected(),
        clientExists: client !== null,
        dbExists: db !== null
    };
};

// Health check
export const healthCheck = async () => {
    try {
        const database = await getDB();
        await database.admin().ping();
        return { status: 'healthy', message: 'MongoDB connection is working' };
    } catch (error) {
        return { status: 'unhealthy', message: error.message };
    }
};


