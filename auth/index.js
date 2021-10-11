const express = require('express');
const cookieSession = require('cookie-session');

const userRoutes = require('./routes/users-routes');

const { HttpError } = require('@adwesh/common/src/index');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, PUT, PATCH, POST, DELETE, GET');
    next();
  });

//should trust requests coming from ingress nginx
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false
}));

app.use('/api/users', userRoutes);

app.use((req,res,next)=>{
    throw new HttpError('Route does not exist', 404);
})

app.use((error, req,res,next)=>{
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || 'An error occured, try again.'})
})

module.exports = app;