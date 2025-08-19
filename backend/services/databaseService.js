import mongoose from "mongoose";

const MONGODB_URI = 'mongodb+srv://zainabsarwar58:zainab984@cluster0.zjkfo.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log("✅ MongoDB already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            isConnected = false;
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        isConnected = false;
        throw error;
    }
};

export const disconnectDB = async () => {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('✅ MongoDB disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};

export const getConnectionStatus = () => {
    return {
        isConnected,
        status: mongoose.connection.readyState
    };
};
