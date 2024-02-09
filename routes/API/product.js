const express = require('express');
const router = express.Router();
const newProductController = require('../../controllers/newProductController');
const inboundController = require('../../controllers/inboundController');
const outboundController = require('../../controllers/outboundController');
const { verifyRoles } = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/rolesList');

router.route('/')
    .get(newProductController.getAllProducts);

router.route('/newproduct')
    .post(verifyRoles(ROLES_LIST.Admin), newProductController.createNewProduct)
    .patch(verifyRoles(ROLES_LIST.Admin), newProductController.updateProduct)

router.route('/newproduct/:productID')
    .delete(verifyRoles(ROLES_LIST.Admin), newProductController.deleteProduct);

router.route('/:productID')
    .get(newProductController.getProduct);

router.route('/inbound')
    .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), inboundController.updateInbound);

router.route('/outbound')
    .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), outboundController.updateOutbound);

module.exports = router;