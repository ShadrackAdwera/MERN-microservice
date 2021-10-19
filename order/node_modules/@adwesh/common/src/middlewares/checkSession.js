const jsonwebtoken = require('jsonwebtoken');

const HttpError = require('../error/httpError');

const checkSession = (req,res,next) => {
    if(req.method==='OPTIONS') {
        return next();
    }
    if(!req.session.jwt) {
        return next(new HttpError('Auth failed', 401));
    }
    let decodedToken;
    //decode token
    try {
        decodedToken = jsonwebtoken.verify(req.session.jwt, process.env.JWT_KEY);
    } catch (error) {
        return next(new HttpError('Auth failed', 401));
    }
    req.user = { userId: decodedToken.id, email: decodedToken.email };
    next();
}

module.exports = checkSession;