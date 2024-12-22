import express from 'express';
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';

const PORT = 3000;
const app = express();

let dishesCount = 4

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname)));

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes.json')));

app.get('/', (req, res) => {
    res.json(data);
});

for (let i = 0; i <= dishesCount; i++){
    app.get('/'+i, (req, res) => {
        res.json(data[i-1]);
    });
}

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`));