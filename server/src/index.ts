import express from 'express';
import { v4 as uuid } from 'uuid'
import cors from 'cors'
import { readdirSync } from "fs"
import { fileURLToPath } from 'url'
import path from 'path'
import multer from 'multer';


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json());
app.use('/memory', express.static(path.join(__dirname, 'memories')))
const port = process.env.PORT || 3000
const file_regex = /\.(jpg|jpeg|png)$/;

const storage = multer.diskStorage(
    {
        destination: 'src/memories',
        filename: function (req, file, cb) {
            cb(null, uuid() + ".jpg");
        }
    }
);
const upload = multer({ storage: storage });


let memories_list: any[] = [];

const refresh = () => {
    memories_list = readdirSync(__dirname + "/memories")
        .filter(file => file.match(file_regex))
        .map(fn => ({
            src: `http://localhost:${port}/memory/${fn}`,
            id: fn.replace(file_regex, ""),
        }))
}

app.get('/memories', (req, res) => { 
    console.log(readdirSync(__dirname + "/memories"))
    refresh();
    res.send(memories_list)
})

app.post('/upload', upload.array("memories"), async (req, res) => {
    refresh()
    res.send(memories_list)
})

app.listen(port, () => console.log(`App listening on port ${port}!`));
