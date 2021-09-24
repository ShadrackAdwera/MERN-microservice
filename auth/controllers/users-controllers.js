const crypto = require('crypto');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/httpError');

const currentUser = {
    name: 'Deez Nuts',
    email: 'deeznuts@mail.com'
}
const USERS = [];

const getCurrentUser = (req,res,next) => {
    res.status(200).json({users: currentUser})
}

const signUp = async(req,res,next) => {
    const { email, password } = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email or password', 422));
    }
    let foundEmail;
    let hashedPassword;
    let token;
    try {
        foundEmail = USERS.find(user=>user.email===email);
    } catch (error) {
        return next(new HttpError('Internal server error',500));
    }
    if(foundEmail) {
        return next(new HttpError('Email exists, sign up',422));
    }

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('Auth failed',401));
    }
    
    const createdUser = {id: crypto.randomUUID().toString(), email, password: hashedPassword}

    USERS.push(createdUser);
    try {
        token = jwt.sign({id: createdUser.id, email: createdUser.email}, 'supersecretkey', { expiresIn: '1h' });
    } catch (error) {
        return next(new HttpError('Auth failed',401));
    }
    res.status(201).json({message: 'Sign up successful', user: { id: createdUser.id, email, token }});
}

const signIn = async(req,res,next) => {
    const { email, password } = req.body;
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email or password',422));
    }
    //check if email exists in db
    const foundUser = USERS.find(user=>user.email===email);
    let isPassword;
    let token;
    if(!foundUser) {
        return next(new HttpError('Email does not exist, try signing up first', 422));
    }

    //check if password for email is correct
    try {
        isPassword = await bcrypt.compare(password, foundUser.password);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!isPassword) {
        return next(new HttpError('Auth failed', 401));
    }
    //create auth token
    try {
        token = jwt.sign({id: foundUser.id, email}, 'supersecretkey', {expiresIn: '1h'})
    } catch (error) {
        return next(new HttpError('Auth failed', 401));
    }
    res.status(201).json({message: 'Sign up successful', user: { id: foundUser.id, email, token }})
}

const signOut = (req,res,next) => {
    res.status(201).json({message: 'Signed Out'});
}

exports.getCurrentUser = getCurrentUser;
exports.signUp = signUp;
exports.signIn = signIn;
exports.signOut = signOut;