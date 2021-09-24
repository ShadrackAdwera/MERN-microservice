const express = require('express');
const userRoutes = require('./routes/users-routes');

const HttpError = require('./models/httpError');

const app = express();

app.use(express.json());

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

app.listen(5000, ()=>{
    console.log('Listening on port: 5000!!');
})