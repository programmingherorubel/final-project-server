const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 9000 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdolxqi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});

// middelware 
app.use(cors())
app.use(express.json())






async function run() {
  try {
    await client.connect();
    const database = client.db("resturent");
    const menuCollection = database.collection("menuCollection");
    const reviewsCollection = database.collection("reviews");
    console.log('database is runnning.....')

        // Menu 
        app.get('/menu',async(req,res)=>{
            const result = await menuCollection.find({}).toArray()
            res.send(result)
        })

        // Review 
        app.get('/reviews',async(req,res)=>{
            const result = await reviewsCollection.find({}).toArray()
            res.send(result)
        })



   
    
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('resturent server is running....')
})

app.listen(port,()=>{
    console.log(`resturent server is running is port number ${port}`)
})