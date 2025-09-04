const jwt = require('jsonwebtoken')
require('dotenv').config()   //.env load / import
const jwtKey = process.env.JWT_SECRET  // secret key save 
console.log('auth jwt key is ', jwtKey)

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']       //token define header
    const token = authHeader && authHeader.split(' ')[1]   // make token
    console.log('token is ', token)                 // check comsole token

    if (!token) {
        return res.status(401).send({ message: 'No token provided' })
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'Invalid token' })
        }
        req.user = user
        next()
    })
}

module.exports = authenticateToken