const Minio = require('minio');
const cors = require('cors');
var client = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: process.env.MINIO_PORT,
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
})

server.get('/presignedGetUrl', (req, res) => {
    // console.log('req:',req.query.name);
    client.presignedGetObject('laravel', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
})

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(process.env.PORT);