const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ 'message' : 'invalid access token!' });

    const accessToken = authHeader.split(' ')[1];

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if(error)
                return res.status(403).json({ 'message' : 'unauthorized!' });

            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;

            next();
        }
    )
}

module.exports = { verifyJWT };