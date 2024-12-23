import express from 'express';
import path from 'path';
import fs from 'fs'
import cors from 'cors'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url';
import 'dotenv/config'

const PORT = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes.json')));
const secret = 'HelloWorld'

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const users = [
    { id: 1, username: process.env.username, password: process.env.password }
]

app.post('/login', (req, res) => {


    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please enter password and/or login' })
    }

    const user = users.find(u => u.username === req.body.username && u.password === req.body.password)


    if (!user) {
        return res.status(400).json({ message: 'Invalid password and/or login' })
    }

    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, secret, { expiresIn: '3 hours' })

    return (res.json({ access_token: token }))
})


const extractBearerToken = headerValue => {
    if (typeof headerValue != 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

const checkTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    if (!token) {
        return res.status(401).json({ message: 'Error >> Need Token' })
    }

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'Error >> Bad Token' })
        } else {
            return next()
        }
    })
}


let dishesCount = data.length
app.use(express.static(path.join(__dirname)));

//ROUTE
app.get('/', (req, res) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    const decoded = jwt.decode(token, { complete: false })
    return res.json({ content: decoded })
    res.json(data);
});
for (let i = 0; i <= dishesCount; i++){
    app.get('/'+i, (req, res) => {
        res.json(data[i-1]);
    });
}



app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`));