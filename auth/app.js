const mongoose = require('mongoose');
const app = require('./index');

mongoose.connect('mongodb://auth-mongo-service:27017/auth').then(()=>{
    app.listen(5000, ()=>{
        console.log('Listening on port: 5000!! Connected to DB.');
    })
}).catch(error=>console.error(error));
