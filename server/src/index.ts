import express from 'express';
import { v4 as uuid } from 'uuid'
import cors from 'cors'
import { readdirSync } from "fs"
import multer from 'multer';
import { hostname } from "os"

const app = express()
app.use(cors())
app.use(express.json());

const memoriesDir = "/mnt/memories"

app.use('/memory', express.static(memoriesDir));
const port = process.env.PORT || 3000
const file_regex = /\.(jpg|jpeg|png)$/;

const storage = multer.diskStorage(
    {
        destination: memoriesDir,
        filename: function (req, file, cb) {
            cb(null, uuid() + ".jpg");
        }
    }
);
const upload = multer({ storage: storage });

const getMemories = () => {
    return readdirSync(memoriesDir)
        .filter(file => file.match(file_regex))
        .map(fn => ({
            dir: memoriesDir,
            src: `https://server-shy-glade-362.fly.dev/memory/${fn}`,
            id: fn.replace(file_regex, ""),
        }));
}

app.get('/memories', (req, res) => { 
    res.send(getMemories())
})

app.post('/upload', upload.array("memories"), async (req, res) => {
    res.send(getMemories())
})

app.listen(port, () => console.log(`
    App listening on port ${port}!\n
    Host: ${hostname()}\n
`));
