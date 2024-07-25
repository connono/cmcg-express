const fs = require("fs");
const docx = require("docx");
const { patchDocument, PatchType, TextRun, Document, CheckBox, Paragraph, Table, TableCell, TableRow, Packer } = docx;

exports.generateDocument = (data, callback) => {
    console.log('data:', data);
    const sourceArray = ['自筹资金', '财政拨款', '专项资金', '学科经费', '名医工作室'];
    const patches = {
        type: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.type === 'create'? '☑' :'□' }新签`),
                new TextRun(`${data.type === 'update'? '☑' :'□' }变更`),
            ]
        },
        contract_name: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun(data.contract_name)],
        },
        isComplement: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.isComplement === 'true'? '☑' :'□' }是`),
                new TextRun(`${data.isComplement === 'false'? '☑' :'□' }否`),
            ]
        },
        complement_code: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({text: data.complement_code? data.complement_code : '       ', underline: {color: '#000000', type: 'single'}})]
            
        },
        series_number: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun(data.series_number)],
        },
        contractor: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun(data.contractor)],
        },
        category: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.category === 'JJXM'? '☑' :'□'}基建项目    `),
                new TextRun(`${data.category === 'YPCG'? '☑' :'□'}药品采购    `),
                new TextRun(`${data.category === 'XXCG'? '☑' :'□'}信息采购    `),
                new TextRun(`${data.category === 'QXCG'? '☑' :'□'}器械采购    `),
                new TextRun(`${data.category === 'QRHZ'? '☑' :'□'}金融合作    `),
                new TextRun(`${data.category === 'WZCG'? '☑' :'□'}物资采购    `),
                new TextRun(`${data.category === 'YLHZ'? '☑' :'□'}医疗合作    `),
                new TextRun(`${data.category === 'YLXS'? '☑' :'□'}医疗协商    `),
                new TextRun(`${data.category === 'DSFFW'? '☑' :'□'}第三方服务  `),
                new TextRun(`${data.category === 'QT'? '☑' :'□'}其他    `),
            ]
        },
        purchase_type:{
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.purchase_type === 'GKZB'? '☑' :'□'}公开招标    `),
                new TextRun(`${data.purchase_type === 'DYLYCG'? '☑' :'□'}单一来源采购`),
                new TextRun(`${data.purchase_type === 'JZXCS'? '☑' :'□'}竞争性磋商  `),
                new TextRun(`${data.purchase_type === 'YQZB'? '☑' :'□'}邀请招标    `),
                new TextRun(`${data.purchase_type === 'XQ'? '☑' :'□'}续签 `),
                new TextRun(`${data.purchase_type === 'JZXTP'? '☑' :'□'}竞争性谈判  `),
                new TextRun(`${data.purchase_type === 'ZFZB'? '☑' :'□'}政府招标采购目录内服务商    `),
                new TextRun(`${data.purchase_type === 'XJ'? '☑' :'□'}询价      `),
                new TextRun(`${data.purchase_type === 'QT'? '☑' :'□'}其他 `),
            ],
        },
        source: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.source === '自筹资金'? '☑' :'□'}自筹资金    `),
                new TextRun(`${data.source === '财政拨款'? '☑' :'□'}财政拨款    `),
                new TextRun(`${data.source === '专项资金'? '☑' :'□'}专项资金    `),
                new TextRun(`${data.source === '学科经费'? '☑' :'□'}学科经费    `),
                new TextRun(`${data.source === '名医工作室'? '☑' :'□'}名医工作室   `),
                new TextRun(`${sourceArray.indexOf(data.source) === -1? '☑' :'□'}其他来源：    `),
                new TextRun({text: sourceArray.indexOf(data.source) === -1 ? data.source : '        ', underline: {color: '#000000', type: 'single'}}),
            ]
        },
        price: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun(data.price)],
        },
        isImportant: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.isImportant === 'true'? '☑' :'□'}是      `),
                new TextRun(`${data.isImportant === 'false'? '☑' :'□'}否      `),
            ]
        },
        dean_type: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.dean_type === 'charge_dean'? '☑' :'□'}分管院长   `),
                new TextRun(`${data.dean_type === 'dean'? '☑' :'□'}院长     `),
            ]
        },
        law_advice: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(`${data.law_advice === 'written_request'? '☑' :'□'}书面征询   `),
                new TextRun(`${data.law_advice === 'oral_inquiry'? '☑' :'□'}口头征询   `),
                new TextRun(`${data.law_advice === 'none'? '☑' :'□'}否   `),
            ]
        },
        comment: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(data.comment ? data.comment : ''),
            ],
        }
   }
    
    patchDocument(fs.readFileSync("template.docx"),{
        keepOriginalStyles: true,
        outputType: "nodebuffer",
        patches,
    }).then((doc) => {
        const docBuffer = Buffer.from(doc.buffer)
        // fs.writeFileSync("My Document.docx", doc);
        callback(docBuffer);
    });
}

// generateDocument({
//     type: 'create',
//     contract_name: '核磁共振维修合同',
//     isComplement: 'true',
//     complement_code: '202403JJ41452',
//     series_number: '202407JJ41421',
//     contractor: 'xxx公司',
//     purchase_type: 'GKZB',
//     category: 'JJXM',
//     source: '自筹资金',
//     price: '1000000',
//     isImportant: 'true',
//     dean_type: 'charge_dean',
//     law_advice: 'written_request',
//     comment: '这是一条评论',
// });