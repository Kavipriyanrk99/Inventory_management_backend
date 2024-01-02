const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productID : {
        type : String,
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    unitPrice : {
        type : Number,
        required : true
    },
    quantityInStock : {
        type : Number,
        required : true
    },
    barcode : {
        type : String
    }, 
    description : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true 
    }
});

module.exports = mongoose.model('Product', productSchema);