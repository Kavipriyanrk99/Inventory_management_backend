const Users = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res) => {
    if(!req.cookies?.jwt)
        return res.status(401).json({ 'message': 'unauthorized!'});
    
    const refreshToken = req.cookies.jwt;

    const foundUser = await Users.findOne({ refreshToken : refreshToken }).exec();
    if(!foundUser) return res.status(403).json({ 'message' : 'forbidden!'});

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decoded) => {
            if(error || foundUser.email !== decoded.email)
                return res.status(403).json({ 'message' : 'forbidden!'});
            
            const roles = Object.values(foundUser.roles).filter((item) => Boolean(item));

            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "email" : foundUser.email,
                        "roles" : roles 
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '15m'}
            );

            res.json({ roles : roles, accessToken : accessToken });
        } 
    );

}

module.exports = { handleRefreshToken };
