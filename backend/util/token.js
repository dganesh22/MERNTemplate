const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// generate secret key using HMAC algorithm
const access_key = process.env.ACCESS_KEY
const key = "Welcome to Nodejs"

// auth token secret
const generateKey = () => {
    return crypto.createHmac('sha1', key).update(access_key).digest('hex');
}

// jwt token
const createAccessToken = async (payload) => {
    let secret_key = generateKey();
    return jwt.sign(payload, secret_key,{ expiresIn: '1d'}) // '1d', '2h', 5*60*1000
};

// cookies
const sendResponseWithCookie = ({ res, id }) => {
    const token = createAccessToken({ id })
    const oneDay = 1000 * 60 * 60 * 24; // 1day
    res.cookie('token', token, {
        httpOnly: true,
        path: `/api/v1/auth/token/validate`,
        expires: new Date(Date.now() + oneDay),
        signed: true
    });
}

module.exports = { createAccessToken, sendResponseWithCookie }