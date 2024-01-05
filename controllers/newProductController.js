const date_fns = require('date-fns');
const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 
const generateID = require('../controllers/utils/generateID');


/* REQUEST HANDLING METHODS */

const getAllProducts = async(req, res) => {
    try{
        const products = await Products.find().exec();
        if(products.length <= 0) return res.status(404).json({'message' : 'No Products found!'});
        res.status(200).json(products);
    } catch(error){
        console.log(error);
    }
};

const createNewProduct = async(req, res) => {

    if(!req.body.productName || !req.body.unitPrice || !req.body.initialQuantity || !req.body.description)
        return res.status(400).json({ 'message': 'product name, unit price, initial quantity and description are required!'});

    if(req.body.unitPrice <= 0 || req.body.initialQuantity < 0)
        return res.status(400).json({ 'message': 'invalid unit price or initial quantity!'});

    try{
        const productID = await generateID.generateProductID();
        const dateNow = date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss');

        const product = new Products({
            productID : productID,
            productName : req.body.productName.trim(),
            unitPrice : parseFloat(req.body.unitPrice),
            quantityInStock : parseInt(req.body.initialQuantity),
            barcode : (req.body.barcode) ? req.body.barcode.trim() : '',
            description : req.body.description.trim(),
            date : dateNow
        });
        product.save();

        const transaction = new TransactionHistory({
            transactionID : await generateID.generateTransactionHistID(),
            productID : productID,
            transactionType : "CREATED",
            quantity : parseInt(req.body.initialQuantity),
            transactionDate : dateNow
        });
        transaction.save();

        res.status(201).json({ 'message': `New Product created!`});
    } catch(error){
        console.log(error);
    }
};

const updateProduct = async(req, res) => {
    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();

        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        if (req.body.productName) product.productName = req.body.productName.trim();
        if (req.body.unitPrice){
            if(req.body.unitPrice > 0)
                product.unitPrice = parseFloat(req.body.unitPrice);
            else
                return res.status(400).json({ 'message': 'invalid unit price!'});
        } 
        if (req.body.initialQuantity){
            if(req.body.initialQuantity >= 0)
                product.quantityInStock = parseInt(req.body.initialQuantity);
            else
                return res.status(400).json({ 'message': 'invalid initial quantity!'});
        }
        if (req.body.barcode) product.barcode = req.body.barcode.trim();
        if (req.body.description) product.description = req.body.description.trim();
        product.date = date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss');

        await product.save();
        
        const transaction = new TransactionHistory({
            transactionID : await generateID.generateTransactionHistID(),
            productID : product.productID,
            transactionType : "UPDATED",
            quantity : parseInt(product.quantityInStock),
            transactionDate : product.date
        });
        transaction.save();

        res.status(201).json({ 'message': `product id ${req.body.productID} updated!`});
    } catch(error){
        console.log(error);
    }
};

const deleteProduct = async(req, res) => {
    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();

        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        const transaction = new TransactionHistory({
            transactionID : await generateID.generateTransactionHistID(),
            productID : product.productID,
            transactionType : "DELETED",
            quantity : parseInt(product.quantityInStock),
            transactionDate : date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')
        });
        transaction.save();
        
        await Products.deleteOne({ productID : req.body.productID});
        res.status(201).json({ 'message': `product id ${req.body.productID} deleted!`});
    }catch(err){
        console.log(err);
    } 
};

const getProduct = async(req, res) => {
    try{
        const product = await Products.findOne({ productID : req.params.productID}).exec();
        if (!product) {
            return res.status(404).json({ 'message': `product id ${req.params.productID} not found!`});
        }
        res.json(product);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getProduct
};