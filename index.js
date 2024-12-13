//import statements

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')
require('./DB/connection')


//create express application

const server = express()

//use middlewares
server.use(cors())
server.use(express.json())
server.use(router)
server.use('/uploads',express.static('uploads'))


//set ports
const port = 4000 ||process.env.PORT

//start server
server.listen(port,()=>{
    console.log(`Express Server is running on port ${port} and waiting for Client requests...`);
})

//get response

server.get('/',(req,res)=>{
    res.send(`<h1>Backend server is running....</h1>`)
})