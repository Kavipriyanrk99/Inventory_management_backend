const date_fns = require('date-fns');
const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 
const generateID = require('./utils/generateID');

const updateInbound = async(req, res) => {
    if(!req.body.date || !req.body.productID || !req.body.quantityReceived || !req.body.description) return res.status(400).json({ 'message': 'product id, quantity received, date and description are required!'});

    if(req.body.quantityReceived <= 0)
        return res.status(400).json({ 'message': 'invlaid quantity received!'});

    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();
        const date = date_fns.format(new Date(req.body.date), 'yyyy/MM/dd\tHH:mm:ss');
        const transactionHistID = await generateID.generateTransactionHistID();
        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        product.quantityInStock += parseInt(req.body.quantityReceived);
        await product.save();

        const transaction = new TransactionHistory({
            transactionID : transactionHistID,
            productID : product.productID,
            transactionType : "IN",
            quantity : parseInt(req.body.quantityReceived),
            transactionDate : date,
            description : req.body.description.trim()
        });
        transaction.save();

        const inboundTransaction = new InboundTransaction({
            transactionID : await generateID.generateInboundTransactionID(),
            transactionHistID : transactionHistID,
            productID : product.productID,
            quantityReceived : parseInt(req.body.quantityReceived),
            transactionDate : date,
            description : req.body.description.trim()
        });

        inboundTransaction.save();

        res.status(201).json({ 'message': `product id ${req.body.productID} quantity updated!`});
    } catch(error){
        console.log(error);
    }
};

module.exports = {
    updateInbound
};