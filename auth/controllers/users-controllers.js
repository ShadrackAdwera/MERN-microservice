//const crypto = require('crypto');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { HttpError } = require('@adwesh/common/src/index');
const User = require('../models/User');


const getCurrentUser = async(req,res,next) => {
    const { userId } = req.user;
    let currentUser;
    try {
        currentUser = await User.findById(userId,'-password').exec()
    } catch (error) {
        return next(new HttpError('An error ocurred, try again',500));
    }
    if(!currentUser) {
        return next(new HttpError('User does not exist', 404));
    }

    res.status(200).json({user: currentUser.toObject({getters: true})})
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
        foundEmail = await User.findOne({email: email}).exec();
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
    
    const createdUser = new User({ email, password: hashedPassword});

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError('Auth failed', 500));
    }

    try {
        token = jwt.sign({id: createdUser._id, email: createdUser.email}, process.env.JWT_KEY, { expiresIn: '1h' });
    } catch (error) {
        return next(new HttpError('Auth failed',401));
    }
    //store jwt in a cookie
    req.session.jwt = token;
    res.status(201).json({message: 'Sign up successful', user: { id: createdUser._id.toString(), email, token }});
}

const signIn = async(req,res,next) => {
    const { email, password } = req.body;
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email or password',422));
    }
    //check if email exists in db
    let foundUser;
    let isPassword;
    let token;
    try {
        foundUser = await User.findOne({email: email}).exec();
    } catch (error) {
        return next(new HttpError('Auth failed',500));
    }
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
        return next(new HttpError('Invalid password', 422));
    }
    //create auth token
    try {
        token = jwt.sign({id: foundUser.id, email}, process.env.JWT_KEY, {expiresIn: '1h'})
    } catch (error) {
        return next(new HttpError('Auth failed', 401));
    }
    req.session.jwt = token;
    res.status(201).json({message: 'Login successful', user: { id: foundUser._id.toString(), email, token }})
}

const signOut = (req,res,next) => {
    req.session = null;
    res.status(200).json({message: 'Signed Out'});
}

exports.getCurrentUser = getCurrentUser;
exports.signUp = signUp;
exports.signIn = signIn;
exports.signOut = signOut;