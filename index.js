const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 9000 

// middelware 
app.use(cors())
app.use(express.json())

// collection name 
// menuCollection
// database name 
// resturent


app.get('/',(req,res)=>{
    res.send('resturent server is running....')
})

app.listen(port,()=>{
    console.log(`resturent server is running is port number ${port}`)
})