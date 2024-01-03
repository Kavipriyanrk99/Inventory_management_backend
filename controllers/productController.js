const date_fns = require('date-fns');
const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 

const generateProductID = async() => {
    const lstProduct = await Products.find().sort({productID: -1}).limit(1);
    const count = (lstProduct.length > 0) ? parseInt(lstProduct[0].productID.split("-")[1]) + 1 : 1;
    const newID = (count < 10) ? `PRD-000${count}` : ((count < 100) ? `PRD-00${count}` : ((count < 1000) ? `PRD-0${count}` : `PRD-${count}`));
    return newID;
};

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

    try{
        const product = new Products({
            productID : await generateProductID(),
            productName : req.body.productName,
            unitPrice : parseFloat(req.body.unitPrice),
            quantityInStock : parseInt(req.body.initialQuantity),
            barcode : (req.body.barcode) ? req.body.barcode : '',
            description : req.body.description,
            date : date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')
        });
        product.save();
    
        res.status(201).json({ 'message': `New Product created!` });
    } catch(error){
        console.log(error);
    }
};

/* const updateEmployee = async(req, res) => {
    try{
        const employee = await Employees.findOne({ id: parseInt(req.body.id) }).exec();

        if (!employee) {
            return res.status(204).json({ "message": `Employee ID ${req.body.id} not found` });
        }
        if (req.body.firstname) await Employees.updateOne({ id: parseInt(req.body.id) }, {firstname: req.body.firstname});
        if (req.body.lastname) await Employees.updateOne({ id: parseInt(req.body.id) }, {lastname: req.body.lastname});
        res.status(201).json({ 'message': `Employee ${req.body.id} updated!` });
    }catch(err){
        console.log(err);
    }
    
} */

const updateProduct = async(req, res) => {
    try{
        const product = await Products.findOne({ productID : req.body.productID}).exec();

        if(!product){
            return res.status(404).json({ 'message': `product id ${req.body.productID} not found!` });
        }

        if (req.body.productName) product.productName = req.body.productName;
        if (req.body.unitPrice) product.unitPrice = parseFloat(req.body.unitPrice);
        if (req.body.initialQuantity) product.quantityInStock = parseFloat(req.body.initialQuantity);
        if (req.body.barcode) product.barcode = req.body.barcode;
        if (req.body.description) product.description = req.body.description;
        product.date = date_fns.format(new Date(), 'yyyy/MM/dd\tHH:mm:ss');

        await product.save();
        
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