const { UnauthenticatedError } = require('../errors')
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const isBearerExists = authHeader.startsWith('Bearer ');
    console.log(isBearerExists, 'isBearerExists')
    if (!isBearerExists) {
        throw new UnauthenticatedError('Authentication failed')
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(payload, 'payload')
        req.user = ({name: payload.name, userId: payload.userId});
        next();
    } catch (err) {
        console.log(err, 'err');
        throw new UnauthenticatedError('Authentication failed')
    }
}

module.exports = auth;