const Users = require('../model/User');

const handleLogout = async(req, res) => {
    if(!req.cookies?.jwt)
        return res.status(200).json({ 'message': 'user not logged in!'});

    const refreshToken = req.cookies.jwt;

    const foundUser = await Users.findOne({ refreshToken : refreshToken }).exec();
    if(!foundUser) return res.status(403).json({ 'message' : 'user not found!'});

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', { httpOnly : true, sameSite : 'None', secure : false });
    return res.status(200).json({ 'message': 'user logged out successfully!'});
}

module.exports = { handleLogout };