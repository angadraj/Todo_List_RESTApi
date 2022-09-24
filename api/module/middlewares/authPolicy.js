require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = async function (req, res, next) {
    if (!req['headers']['authorization']) {
        return res.status(401).json({
            message: 'Auth Header is missing!'
        })
    }
    let token = req.headers['authorization'].split(' ')[1] || req.headers['authorization'];
    if (!token) {
        return res.status(403).json({
            message: 'No Token provided'
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            console.log(err)
            return res.status(401).json({
                message: 'unauthorized!'
            })
        }
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    });
}

const authJwt = {
    verifyToken
}
module.exports = authJwt;