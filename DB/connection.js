const mongoose = require('mongoose')

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('MongoDB Atlas Connected');
}).catch((err)=>{
    console.log('MongoDB Connection Error...',err);
})