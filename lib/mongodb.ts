import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/threesixtyluxury';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('--- MONGODB: Attempting to connect... ---');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('+++ MONGODB: Connection successful! +++');
            return mongoose;
        }).catch((err) => {
            console.error('xxx MONGODB: Connection failed! xxx');
            console.error('Error Name:', err.name);
            console.error('Error Message:', err.message);
            if (err.reason) console.error('Connection Reason:', err.reason);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;