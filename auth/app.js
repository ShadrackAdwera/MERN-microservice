const express = require('express');
const userRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(5000, ()=>{
    console.log('Listening on port: 5000!!');
})