const Minio = require('minio');
const cors = require('cors');
const dotenv = require('dotenv');
const multipart = require('connect-multiparty');
const docxs = require('./docx');
const xlsxs = require('./xlsx');
const fs = require('fs');
const readXlsx = require('./readXlsx');
const binconv = require('binconv');
const multer = require('multer');

const multipartMiddleware = multipart();

dotenv.config({path: './.env'});

const client = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
    region: 'cn-north-1',
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');
    },
    filename: (req, file, cb) => {
        cb(null, 'analyze.xlsx');
    }
})

const upload = multer({storage: storage});

const limits = { fileSize: 1024 * 1024 * 500, // 500MB max file size
    files: 1, // 限制一次上传一个文件
    fieldSize: 1024 * 1024 * 500 // 500MB max field size
};

const server = require('express')();

server.use(cors());

server.get('/presignedPutUrl', async (req, res) => {
    // console.log('req:',req.query.name);
    await client.presignedPutObject('laravel', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
});

server.get('/presignedGetUrl', async (req, res) => {
    // console.log('req:',req.query.name);
    await client.presignedGetObject('laravel', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
});

server.post('/generateDocument', multipartMiddleware, async (req, res) => {
    await docxs.generateDocument(req.body, (buffer)=>{
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

server.post('/storeXlsx', upload.single('file'), async (req, res) => {
    await readXlsx.storeXlsx();
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end('已完成');
});

server.delete('/clearDatabase', multipartMiddleware, async(req, res) => {
   readXlsx.clearDatabase();
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end('已清空');
});

server.post('/generateXlsx', multipartMiddleware, async (req, res) => {
    if (req.body.url) {
        await client.removeObject('laravel', req.query.url);
    }
    const data = JSON.parse(req.body.data);

    await xlsxs.generateXlsx(data, (buffer)=>{
        const filePath =  req.body.url ? req.body.url : `xlsx/${Date.now()}.xlsx`;
        client.putObject('laravel', filePath, buffer)
            .catch((err) => {
                console.log('err:', err);
            })
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(filePath);
    });
});

// server.post('/branchXlsx', multipartMiddleware, async (req, res) => {
//     await client.presignedGetObject('laravel', req.body.excel_url, (err, url) => {
//         fetch(url, {
//             method: 'GET',
//         }).then(async (result) => {
//             await xlsxs.branchXlsx(result.body, req.body.signature, req.body.position, async (data)=>{
//                 await client.removeObject('laravel', req.body.excel_url);
//                 await client.putObject('laravel', req.body.excel_url, data, (result) => {
//                 })
//             })
//         })     
//     })
// });

server.listen(process.env.PORT);