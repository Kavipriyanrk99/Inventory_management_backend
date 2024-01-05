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
                quantityInStock: '$productDetails.quantityInStock'
            }
          }
        ]);

        if(transactions.length <= 0) return res.status(404).json({'message' : 'No transactions found!'});

        res.status(200).json(transactions);
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    getAllTransactions
}