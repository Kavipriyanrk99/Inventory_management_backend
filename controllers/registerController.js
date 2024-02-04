const Users = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    if(!req.body.username || !req.body.email || !req.body.password)
        return res.status(400).json({ 'message': 'username, email and password are required!'});

    const duplicateUser = await Users.findOne({ email : req.body.email}).exec();
    if(duplicateUser)
        return res.status(409).json({ 'message': 'user already found!'});

    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({
            username : username,
            email : email,
            password : hashedPassword 
        });

        user.save();
        res.status(201).json({ 'message': `new user created!`});
    } catch(error){
        res.status(500).json({ 'message': error.message});
    }
}

module.exports = { handleNewUser };
