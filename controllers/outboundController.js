const date_fns = require('date-fns');
const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 

const updateOutbound = async(req, res) => {
    if(!req.body.date || !req.body.productID || !req.body.quantitySold || !req.body.description) return res.status(400).json({ 'message': 'product id, quantity sold, date and description are required!'});

    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();

        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        product.quantityInStock -= parseInt(req.body.quantitySold);
        await product.save();

        res.status(201).json({ 'message': `product id ${req.body.productID} quantity updated!`});
    } catch(error){
        console.log(error);
    }
};

module.exports = {
    updateOutbound
};