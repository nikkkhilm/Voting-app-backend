const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const authRoute =require('./Routes/authRoute')
const mongoose = require('mongoose');
const connectdb = require('./db');
const candidateRoute = require('./Routes/candidateRoute')

app.use(express.json())

app.use('/user',authRoute);

app.use('/candidate/vote',candidateRoute);




const port = process.env.PORT;

connectdb().then(()=>
{
app.listen(port || 5000,()=>{
    console.log(`app is listening in ${port}`);
});
}
);

