const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');

router.route('/')
    .get(transactionController.getAllTransactions)
    .delete(transactionController.delTransactionHist);

router.route('/inbound')
    .get(transactionController.getInboundTransactions);

router.route('/outbound')
    .get(transactionController.getOutboundTransactions);

module.exports = router;

