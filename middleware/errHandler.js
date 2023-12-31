const { logEvents } = require("./logEvents");

const errHandler = (err, req, res, next) => {
    console.log(`${err.name}: ${err.message}`);
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    next();
}

module.exports = {errHandler};