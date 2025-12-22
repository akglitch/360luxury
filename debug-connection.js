const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const logPath = path.resolve(__dirname, 'mongodb-debug.log');

let uri = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match) {
        uri = match[1].trim();
    }
} catch (err) {
    fs.writeFileSync(logPath, 'Could not read .env.local\n' + err.message);
    process.exit(1);
}

// Clean the URI if there are quotes
uri = uri.replace(/^["']|["']$/g, '');

const startTime = Date.now();
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        fs.writeFileSync(logPath, 'SUCCESS: Connected at ' + new Date().toISOString());
        process.exit(0);
    })
    .catch(err => {
        const errorData = {
            message: err.message,
            name: err.name,
            reason: err.reason,
            code: err.code,
            stack: err.stack,
            time: new Date().toISOString(),
            duration: Date.now() - startTime
        };
        fs.writeFileSync(logPath, JSON.stringify(errorData, null, 2));
        process.exit(1);
    });
