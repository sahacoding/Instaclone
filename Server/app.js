const express = require('express');
const app = express();
const mongoose = require('./db');
//const cors = require ('cors')

//app.use(cors())

app.use(express.json());
app.use( '/api/auth', require('./routes/auth'))
app.use( '/api/post', require('./routes/post'))
app.use( '/api/user', require('./routes/user'))

app.get('/', (req, res)=>{
    res.send("Hello world")
})

app.listen('3033',() =>{
    console.log('app listen on port 3033')
})