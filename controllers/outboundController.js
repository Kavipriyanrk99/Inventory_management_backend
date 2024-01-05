const date_fns = require('date-fns');
const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 
const generateID = require('./utils/generateID');

const updateOutbound = async(req, res) => {
    if(!req.body.date || !req.body.productID || !req.body.quantitySold || !req.body.description) return res.status(400).json({ 'message': 'product id, quantity sold, date and description are required!'});

    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();
        const date = date_fns.format(new Date(req.body.date), 'yyyy/MM/dd\tHH:mm:ss');
        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        if(parseInt(req.body.quantitySold) <= 0 || parseInt(req.body.quantitySold) > product.quantityInStock)
            return res.status(400).json({ 'message': 'invalid quantity sold!'});

        product.quantityInStock -= parseInt(req.body.quantitySold);
        await product.save();

        const transaction = new TransactionHistory({
            transactionID : await generateID.generateTransactionHistID(),
            productID : product.productID,
            transactionType : "OUT",
            quantity : parseInt(req.body.quantitySold),
            transactionDate : date
        });
        transaction.save();

        const outboundTransaction = new OutboundTransaction({
            transactionID : await generateID.generateOutboundTransactionID(),
            productID : product.productID,
            quantitySold : parseInt(req.body.quantitySold),
            transactionDate : date
        });

        outboundTransaction.save();

        res.status(201).json({ 'message': `product id ${req.body.productID} quantity updated!`});
    } catch(error){
        console.log(error);
    }
};

module.exports = {
    updateOutbound
};