const jwt = require('jsonwebtoken')

const HttpError = require('../models/httpError');

const checkAuth = (req,res,next) => {
    if(req.method==='OPTIONS') {
        return next()
    }
    const tkn = req.get('Authorization');
    if(!tkn) {
        return next(new HttpError('Auth failed', 401));
    }
    const token = tkn.split(' ')[1];
    if(!token) {
        return next(new HttpError('Auth failed', 401));
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        return next(new HttpError('Auth failed', 401));
    }
    req.user = { userId: decodedToken.id  }
    next();
}

module.exports = checkAuth;