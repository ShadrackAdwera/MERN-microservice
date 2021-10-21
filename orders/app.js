const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('@adwesh/common/src/error/httpError');

const orderRoutes = require('./routes/order-routes');

const app = express();

app.use(express.json());

//CORS

app.use('/api/orders', orderRoutes);

app.use((req,res,next)=>{
    return next(new HttpError('This method / route does not exist', 404));
})

app.use((error, req, res, next)=>{
    if(res.headersSent) {
        return next(error);
    }
    res.status(error.status || 500).json({message: error.message || 'An error occured, try again'});
});

mongoose.connect('mongodb://orders-mongo-service:27017/orders').then(()=>{
    console.log('Connected to DB, listening on PORT 5002');
}).catch(error=>console.log(error));