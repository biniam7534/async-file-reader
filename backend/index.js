const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const FILES_DIR = path.join(__dirname, 'files');
const files = ['a.txt', 'b.txt', 'c.txt'];

/**
 * Task Requirement: Reads all three files asynchronously using async/await.
 * Prints the content of each file to the console.
 * Calculates and prints the total number of characters from all three files.
 */
async function processFiles() {
    try {
        console.log('\n--- Processing Files (Task 2) ---');
        let totalChars = 0;
        const fileContents = [];

        // Reading files asynchronously and mapping them to promises
        const readPromises = files.map(async (file) => {
            const filePath = path.join(FILES_DIR, file);
            const content = await fs.readFile(filePath, 'utf-8');
            return { name: file, content };
        });

        // Use Promise.all to wait for all files (true async concurrent reading)
        const results = await Promise.all(readPromises);

        results.forEach(res => {
            console.log(`\n📄 Content of ${res.name}:`);
            console.log('------------------------');
            console.log(res.content);
            console.log('------------------------');
            totalChars += res.content.length;
            fileContents.push(res);
        });

        console.log(`\n📊 Total Characters: ${totalChars}\n`);
        return { fileContents, totalChars };
    } catch (error) {
        console.error('Error processing files:', error.message);
        throw error;
    }
}

// API Endpoint for the MERN Frontend
app.get('/api/files', async (req, res) => {
    try {
        const data = await processFiles();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read files' });
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/async_file_reader';

// Connect to MongoDB (non-blocking)
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.warn('⚠️ MongoDB connection failed.'));

// Start server immediately
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Task Requirement: Run the script logic
    await processFiles();
});
