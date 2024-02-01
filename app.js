const Minio = require('minio');
const cors = require('cors');
const dotenv = require('dotenv');
const multipart = require('connect-multiparty');
const docxs = require('./docx');

const multipartMiddleware = multipart();

dotenv.config({path: './.env'});

var client = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
});

const server = require('express')();

server.use(cors());

server.get('/presignedPutUrl', (req, res) => {
    // console.log('req:',req.query.name);
    client.presignedPutObject('laravel', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
});


server.get('/presignedGetUrl', (req, res) => {
    // console.log('req:',req.query.name);
    client.presignedGetObject('laravel', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
});

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.post('/generateDocument', multipartMiddleware, (req, res) => {
    docxs.generateDocument(req.body, (buffer)=>{
        const filePath = `docx/${Date.now()}_${req.body.contract_name}.docx`;
        client.putObject('laravel', filePath, buffer)
            .catch((err) => {
                console.log('err:', err);
            })
        console.log(filePath);
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(filePath);
    });
    
});

server.listen(process.env.PORT);