const XLSX = require('xlsx-extract').XLSX;
const mysql = require('mysql');
const fs = require('fs');
const _ = require('lodash');
const dotenv = require('dotenv');


const connection = mysql.createConnection({
    host: process.env.ENDPOINT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

connection.connect();

const isUndefined = (value) => {
	if(value === null) return "";
	if(value === undefined) return "";
   	return  value;
}

const normalizeString = (value) => {
	if(_.isString(value)) return value.replaceAll("'", "").replaceAll("\\", "");
	else return value.toString().replaceAll("'", "").replaceAll("\\", "");
}

exports.storeXlsx = async () => {

	let count = 0;

    new XLSX().extract('./analyze.xlsx', {sheet_id:1}) // or sheet_name or sheet_nr
		.on('row', function (row) {
			let string = '';
			for(let i=0; i<24; i++){
				if(i!=23) string += `'${normalizeString(isUndefined(row[i]))}',`;
				else string += `'${normalizeString(isUndefined(row[i]))}'`;
			}
            connection.query(`INSERT INTO consumable_nets (consumable_net_id, category, parent_directory, child_directory, product_id, consumable, registration_num, registration_name, registration_date, consumable_encoding, specification, model, units, manufacturer, company, company_encoding, price, tempory_price, source_name, product_remark, net_date, purchase_category, net_status, withdrawal_time) VALUES (${string})`);
			count++;
		})
		.on('error', function (err) {
			console.error('error', err);
		})
		.on('end', function (err) {
			console.log('eof');
		});
}

exports.clearDatabase = () => {
	connection.query('TRUNCATE TABLE consumable_nets;');
}
