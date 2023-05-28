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
    const cartCollection = database.collection("carts");
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

        // cart 
        app.post('/carts',async(req,res)=>{
            const info = req.body 
            const result = await cartCollection.insertOne(info)
            res.send(result)
        })

        app.get('/carts',async(req,res)=>{
            const email = req.query.email
            if(!email){
                res.send([])
            }
            const query = {email:email}
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/carts/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await cartCollection.deleteOne(query)
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