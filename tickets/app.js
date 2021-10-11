const mongoose = require('mongoose');

const app = require('./index');

mongoose.connect('mongodb://tickets-mongo-service:27017/tickets').then(()=>{
    app.listen(5001);
    console.log('Connected to tickets DB, listenting on port: 5001');
}).catch(error=>console.log(error));

