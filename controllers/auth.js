const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    return jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

const register = async (req, res) => {
    const user = await User.create({ ...req.body });

    const token = createToken(user)
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const token = createToken(user);
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login,
}
