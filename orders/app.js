const mongoose = require('mongoose');

const app = require('./index');

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(5002);
    console.log('Connected to Orders DB, listening on PORT 5002');
}).catch(error=>console.log(error));