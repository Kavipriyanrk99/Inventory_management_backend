const Products = require('../model/Product');
const {TransactionHistory, InboundTransaction, OutboundTransaction} = require('../model/Transaction'); 

const getAllTransactions = async(req, res) => {
    try{
        const transactions = await TransactionHistory.aggregate([{
            $lookup: {
                from: 'products',
                localField: 'productID',
                foreignField: 'productID',
                as: 'productDetails'
            }
          },
          {
            $unwind: '$productDetails'
          },
          {
            $project: {
                transactionID: 1,
                productID: 1,
                productName: '$productDetails.productName',
                transactionType: 1,
                quantity: 1,
                transactionDate: 1,
                quantityInStock: '$productDetails.quantityInStock',
                unitPrice: '$productDetails.unitPrice',
                description: 1
            }
          }
        ]);

        if(transactions.length <= 0) return res.status(404).json({'message' : 'No transactions found!'});

        res.status(200).json(transactions);
    } catch(error){
        console.log(error);
    }
}

const getInboundTransactions = async(req, res) => {
    try{
        const inboundTransactions = await InboundTransaction.aggregate([{
            $lookup: {
                from: 'products',
                localField: 'productID',
                foreignField: 'productID',
                as: 'productDetails'
            }
          },
          {
            $unwind: '$productDetails'
          },
          {
            $project: {
                transactionID: 1,
                productID: 1,
                productName: '$productDetails.productName',
                quantityReceived: 1,
                transactionDate: 1,
                quantityInStock: '$productDetails.quantityInStock'
            }
          }
        ]);

        if(inboundTransactions.length <= 0) return res.status(404).json({'message' : 'No inbound transactions found!'});
        
        res.status(200).json(inboundTransactions);
    } catch(error){
        console.log(error);
    }
}

const getOutboundTransactions = async(req, res) => {
    try{
        const outboundTransactions = await OutboundTransaction.aggregate([{
            $lookup: {
                from: 'products',
                localField: 'productID',
                foreignField: 'productID',
                as: 'productDetails'
            }
          },
          {
            $unwind: '$productDetails'
          },
          {
            $project: {
                transactionID: 1,
                productID: 1,
                productName: '$productDetails.productName',
                quantitySold: 1,
                transactionDate: 1,
                quantityInStock: '$productDetails.quantityInStock'
            }
          }
        ]);

        if(outboundTransactions.length <= 0) return res.status(404).json({'message' : 'No outbound transactions found!'});
        
        res.status(200).json(outboundTransactions);
    } catch(error){
        console.log(error);
    }
}

const delTransactionHist = async(req, res) => {
    try{
        const transaction = await TransactionHistory.findOne({ transactionID : req.body.transactionID}).exec();
        if(!transaction){
            return res.status(404).json({ 'message': `transaction id ${req.body.transactionID} not found!` });
        }

        if(transaction.transactionType === 'IN')
            await InboundTransaction.deleteOne({ transactionHistID : req.body.transactionID});

        if(transaction.transactionType === 'OUT')
            await OutboundTransaction.deleteOne({ transactionHistID : req.body.transactionID});

        await TransactionHistory.deleteOne({ transactionID : req.body.transactionID});
        res.status(201).json({ 'message': `transaction id ${req.body.transactionID} deleted!`});
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    getAllTransactions,
    getInboundTransactions,
    getOutboundTransactions,
    delTransactionHist
};