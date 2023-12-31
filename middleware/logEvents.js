const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const date_fns = require('date-fns');
const uuid = require('uuid');

const logEvents = async(message, filename) => {
    try{
        const logData = `${date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}\t${uuid.v4()}\t${message}\n`;

        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', filename), logData);
    } catch(error){
        console.log(error);
    }
}

const logger = async(req, res, next) => {
    console.log(`${req.url}\t${req.method}`);
    await logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    next();
}

module.exports = {logEvents, logger};