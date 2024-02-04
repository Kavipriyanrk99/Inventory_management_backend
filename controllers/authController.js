const Users = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) => {
    if(!req.body.email || !req.body.password)
        return res.status(400).json({ 'message': 'email and password are required!'});

    const foundUser = await Users.findOne({ email : req.body.email}).exec();
    if(!foundUser)
        return res.status(401).json({ 'message': 'unauthorized!'});

    const email = req.body.email;
    const password = req.body.password;
    const match = await bcrypt.compare(password, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = jwt.sign(
            {
                "UserInfo" : {
                    "email" : foundUser.email,
                    "roles" : roles 
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '30s'}
        );

        const refreshToken = jwt.sign(
            {
                "email" : foundUser.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn : '1d'}
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, { httpOnly : true, secure : false, sameSite : 'None', maxAge : 24 * 60 * 60 * 1000 });

        res.json({ roles : roles, accessToken : accessToken });
    } else{
        return res.status(401).json({ 'message': 'unauthorized!'});
    }
}

module.exports = { handleLogin };