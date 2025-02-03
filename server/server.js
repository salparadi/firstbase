// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const app = express();
const port = 7778;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
