const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');
const { verifyRoles } = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/rolesList');

router.route('/')
    .get(transactionController.getAllTransactions)
    .delete(verifyRoles(ROLES_LIST.Admin), transactionController.delTransactionHist);

router.route('/inbound')
    .get(transactionController.getInboundTransactions);

router.route('/outbound')
    .get(transactionController.getOutboundTransactions);

module.exports = router;

