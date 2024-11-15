const ExcelJS = require('exceljs');
const _  = require('lodash');

exports.generateXlsx = async (data, callback) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('templatee.xlsx');
    const worksheet = workbook.getWorksheet(1);
    //设置页首
    const date = new Date(Date.now());
    const cell_name = worksheet.getCell('A1');
    cell_name.value = `${date.getFullYear()}.${date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+ (date.getMonth()+1)}应付款汇款审批单`;
    const cell_time = worksheet.getCell('J3');
    cell_time.value = `日期：${date.getFullYear()}年${date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+ (date.getMonth()+1)}月${date.getDate() > 9 ? date.getDate() : '0'+ date.getDate()}日`;
    //循环渲染数据
    _.map(data, (array, aIndex) => {
        _.map(array, (item, iIndex) => {
            let cell = worksheet.getCell(`${String.fromCharCode(65+iIndex)}${6+aIndex}`);
            cell.value =  !_.isNull(item) ? item : '-';
        });
    });
    // //循环渲染签名
    // signatureAnchors = [
    //     {col: 0.3, row: 15},
    //     {col: 1.3, row: 15},
    //     {col: 4.3, row: 15},
    //     {col: 8, row: 15},
    //     {col: 9.2, row: 15},
    // ];
    // if(images && images.length && images.length != 0) {
    //     _.map(images, (image, index) => {
    //         let imageId = workbook.addImage({
    //             base64: image,
    //             extension: 'png',
    //         });
    //         worksheet.addImage(imageId, {
    //             tl: signatureAnchors[index],
    //             ext: {width: 80, height: 40}
    //         });        
    //     });        
    // }

    const buffer = await workbook.xlsx.writeBuffer();
    callback(buffer);
}

// exports.branchXlsx = async (stream, signature, position, callback) => {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.read(stream);
//     const worksheet = workbook.getWorksheet(1);
//     // signatureAnchors = [
//     //     {col: 0.3, row: 15},
//     //     {col: 1.3, row: 15},
//     //     {col: 4.3, row: 15},
//     //     {col: 8, row: 15},
//     //     {col: 9.2, row: 15},
//     // ];
//     // if (signature) {
//     //     let imageId = workbook.addImage({
//     //         base64: signature,
//     //         extension: 'png',
//     //     });
//     //     worksheet.addImage(imageId, {
//     //         tl: signatureAnchors[position],
//     //         ext: {width: 80, height: 40},
//     //     });
//     // }

//     const buffer = await workbook.xlsx.writeBuffer();
//     // console.log('buffer:', buffer)
//     callback(buffer);
// }

// const data = [
//     ['杭州益众贸易有限公司', '呼吸机', 180000, '首款', '-', '-', 162000, 18000, '验收合格90工作日内付合同金额90%', '验收合格90工作日内支付90%，一年内支付剩余10%   (11月27日入库)'],
//     ['浙江康原医疗科技有限公司', '医用升温毯', 29000, '首款', '-', '-', 26100, 2900, '验收合格后3个月内付合同金额90%', '验收合格3个月内支付90%，一年内支付剩余10%     (10月20日入库)'],
// ];

// const images = [
//     'data:image/png;base64,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', 
//     'data:image/png;base64,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',
//     'data:image/png;base64,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',
//     'data:image/png;base64,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',
//     'data:image/png;base64,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',
// ];

// generateXlsx(data, images);
