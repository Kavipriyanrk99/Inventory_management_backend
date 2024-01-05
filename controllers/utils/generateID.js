const date_fns = require('date-fns');
const Products = require('../../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../../model/Transaction'); 

const generateProductID = async() => {
    const lstProduct = await Products.find().sort({productID: -1}).limit(1);
    const count = (lstProduct.length > 0) ? parseInt(lstProduct[0].productID.split("-")[1]) + 1 : 1;
    const newID = (count < 10) ? `PRD-000${count}` : ((count < 100) ? `PRD-00${count}` : ((count < 1000) ? `PRD-0${count}` : `PRD-${count}`));
    return newID;
};

const generateTransactionHistID = async() => {
    const lstTransaction = await TransactionHistory.find().sort({transactionID: -1}).limit(1);
    const count = (lstTransaction.length > 0) ? parseInt(lstTransaction[0].transactionID.split("-")[2]) + 1 : 1;
    const year = date_fns.format(new Date(), 'yyyy');
    const newID = (count < 10) ? `TRANS-${year}-000${count}` : ((count < 100) ? `TRANS-${year}-00${count}` : ((count < 1000) ? `TRANS-${year}-0${count}` : `TRANS-${year}-${count}`));

    return newID;
};

const generateInboundTransactionID = async() => {
    const lstInboundTransaction = await InboundTransaction.find().sort({transactionID: -1}).limit(1);
    const count = (lstInboundTransaction.length > 0) ? parseInt(lstInboundTransaction[0].transactionID.split("-")[2]) + 1 : 1;
    const year = date_fns.format(new Date(), 'yyyy');
    const newID = (count < 10) ? `IN-${year}-000${count}` : ((count < 100) ? `IN-${year}-00${count}` : ((count < 1000) ? `IN-${year}-0${count}` : `IN-${year}-${count}`));

    return newID;
}

const generateOutboundTransactionID = async() => {
    const lstOutboundTransaction = await OutboundTransaction.find().sort({transactionID: -1}).limit(1);
    const count = (lstOutboundTransaction.length > 0) ? parseInt(lstOutboundTransaction[0].transactionID.split("-")[2]) + 1 : 1;
    const year = date_fns.format(new Date(), 'yyyy');
    const newID = (count < 10) ? `OUT-${year}-000${count}` : ((count < 100) ? `OUT-${year}-00${count}` : ((count < 1000) ? `OUT-${year}-0${count}` : `OUT-${year}-${count}`));

    return newID;
}

module.exports = {
    generateProductID,
    generateTransactionHistID,
    generateInboundTransactionID,
    generateOutboundTransactionID
};