const express = require('express');
const router = express.Router();
const newProductController = require('../../controllers/newProductController');
const inboundController = require('../../controllers/inboundController');
const outboundController = require('../../controllers/outboundController');

router.route('/')
    .get(newProductController.getAllProducts);

router.route('/newproduct')
    .post(newProductController.createNewProduct)
    .patch(newProductController.updateProduct)

router.route('/newproduct/:productID')
    .delete(newProductController.deleteProduct);

router.route('/:productID')
    .get(newProductController.getProduct);

router.route('/inbound')
    .patch(inboundController.updateInbound);

router.route('/outbound')
    .patch(outboundController.updateOutbound);

module.exports = router;