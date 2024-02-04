const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ROLES_LIST } = require('../config/rolesList');

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    roles : {
        Admin : {
            type : Number,
            default : ROLES_LIST.Admin 
        },
        Editor : Number
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : String
});

const Users = mongoose.model('User', userSchema);

module.exports = {
    Users
};