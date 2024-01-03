const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createNewProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

router.route('/:productID')
    .get(productController.getProduct);

module.exports = router;