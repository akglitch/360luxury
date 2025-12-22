const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
let uri = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match) {
        uri = match[1].trim();
    }
} catch (err) {
    console.error('Could not read .env.local file');
    process.exit(1);
}

console.log('Testing URI:', uri ? uri.substring(0, 20) + '...' : 'UNDEFINED');

if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

if (uri.includes('<db_username>') || uri.includes('<db_password>')) {
    console.error('PLACEHOLDERS STILL PRESENT: Please replace <db_username> and <db_password> with your actual credentials.');
    process.exit(1);
}

// Clean the URI if there are quotes
uri = uri.replace(/^["']|["']$/g, '');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error(err.message);
        process.exit(1);
    });
