const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionHistorySchema = new Schema({
    transactionID : {
        type : String,
        required : true
    },
    productID : {
        type : String,
        required : true
    },
    transactionType : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    transactionDate : {
        type : Date,
        required : true
    }
});

const inboundTransactionSchema = new Schema({
    transactionID : {
        type : String,
        required : true
    },
    productID : {
        type : String,
        required : true
    },
    quantityReceived : {
        type : Number,
        required : true
    },
    transactionDate : {
        type : Date,
        required : true
    }
});

const outboundTransactionSchema = new Schema({
    transactionID : {
        type : String,
        required : true
    },
    productID : {
        type : String,
        required : true
    },
    quantitySold : {
        type : Number,
        required : true
    },
    transactionDate : {
        type : Date,
        required : true
    }
});

const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);
const InboundTransaction = mongoose.model('InboundTransaction', inboundTransactionSchema);
const OutboundTransaction = mongoose.model('OutboundTransaction', outboundTransactionSchema);

module.exports = {
    TransactionHistory,
    InboundTransaction,
    OutboundTransaction
};

