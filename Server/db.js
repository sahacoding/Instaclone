const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/instragram-Clone')
.then(()=>{
    console.log('Mongo Connection Open!!')
}).catch(err =>{
    console.log("Oh no Mongo Error!!")
    console.log(err)
})



module.exports = mongoose;