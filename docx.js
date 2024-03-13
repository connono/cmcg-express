const fs = require("fs");
const docx = require("docx");
const { patchDocument, PatchType, TextRun, CheckBox } = docx;

exports.generateDocument = (data, callback) => {
    console.log(data);
    const sourceArray = ['自筹资金', '财政拨款', '专项资金', '学科经费', '名医工作室'];
    const patches = {
        contract_name: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun(data.contract_name)],
        },
        isComplement: {
            type: PatchType.PARAGRAPH,
            children: [
                new CheckBox({checked: data.isComplement === 'true'}),
                new TextRun("是"),
                new CheckBox({checked: data.isComplement === 'false'}),
                new TextRun("否"),
            ]
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
                new CheckBox({checked: data.category === 'JJ'}),
                new TextRun("基建项目    "),
                new CheckBox({checked: data.category === 'YP' || data.category === 'QX'}),
                new TextRun("药械采购    "),
                new CheckBox({checked: data.category === 'XX'}),
                new TextRun("信息采购    "),
                new CheckBox({checked: data.category === 'XS'}),
                new TextRun("医疗协商    "),
                new CheckBox({checked: data.category === 'HZ'}),
                new TextRun("医疗合作    "),
                new CheckBox({checked: data.category === 'ZW'}),
                new TextRun("物资采购    "),
                new CheckBox({checked: data.category === 'FW'}),
                new TextRun("服务项目    "),
            ]
        },
        source: {
            type: PatchType.PARAGRAPH,
            children: [
                new CheckBox({checked: data.source === '自筹资金'}),
                new TextRun("自筹资金    "),
                new CheckBox({checked: data.source === '财政拨款'}),
                new TextRun("财政拨款    "),
                new CheckBox({checked: data.source === '专项资金'}),
                new TextRun("专项资金    "),
                new CheckBox({checked: data.source === '学科经费'}),
                new TextRun("学科经费    "),
                new CheckBox({checked: data.source === '名医工作室'}),
                new TextRun("名医工作室   "),
                new CheckBox({checked: sourceArray.indexOf(data.source) === -1}),
                new TextRun("其他来源："),
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
                new CheckBox({checked: data.isImportant === 'true'}),
                new TextRun("是"),
                new CheckBox({checked: data.isImportant === 'false'}),
                new TextRun("否"),
            ]
        },
        comment: {
            type: PatchType.PARAGRAPH,
            children: [
                new TextRun(data.comment),
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
//     contract_name: '核磁共振维修合同',
//     isComplement: true,
//     series_number: '202407JJ41421',
//     contractor: 'xxx公司',
//     category: 'JJ',
//     source: '其他来源11111',
//     price: 1000000,
//     isImportant: true,
// });