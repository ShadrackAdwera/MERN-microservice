const express = require('express');
const { HttpError } = require('@adwesh/common/src/index');

const ticketRoutes = require('./routes/ticket-routes');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, PUT, PATCH, POST, DELETE, GET');
    next();
  });
app.use('/api/tickets', ticketRoutes);

app.use((req,res,next)=>{
    throw new HttpError('Method / Route does not exist', 404);
});

app.use((error, req,res,next)=>{
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({message: error.message || 'An error occured, try again'});
})

module.exports = app;