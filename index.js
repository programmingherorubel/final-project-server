const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 9000 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdolxqi.mongodb.net/?retryWrites=true&w=majority`;
const accessToken = 'c2399fd28620aeb53ea084dc81ab53534a86599cc71b0a3311b592e1985bd8abbe9da2a6f6f32c90721c8d8d94c8b7407421db77b607d3120901764cf1f5f0bc'
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});
// middelware 
app.use(cors())
app.use(express.json())

// jwt veryfy Middelware 
const verifyJwt = (req,res,next)=>{
    const authorization = req.headers.authorization 
        if(authorization){
            return res.status(401).send({error:true,message:'Authoriz User Access'})
        }
    const token = authorization.split(' ')[1]
    jwt.verify(token,accessToken,(err,decoded)=>{
        if(err){
            return res.status(401).send({error:true,message:'Authoriz User Access'})
        }
        req.decoded = decoded
        next()
    })
}

async function run() {
  try {
    await client.connect();
    const database = client.db("resturent");
    const menuCollection = database.collection("menuCollection");
    const reviewsCollection = database.collection("reviews");
    const cartCollection = database.collection("carts");
    const userCollection = database.collection("users")
    console.log('database is runnning.....')

    //    ---------------- jwt -----------
    app.post('/jwt',(req,res)=>{
        const user = req.body 
        const token = jwt.sign(user,accessToken,{
            expiresIn:"1h"
        })
        res.send(token)
    })
    //    ---------------- jwt -----------



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

        app.get('/carts',verifyJwt, async(req,res)=>{
            const email = req.query.email
            if(!email){
                res.send([])
            }
            const decodedEmail = req.decoded.email
            if(email !== decodedEmail){
                return res.status(403).send({error:true,message:'forbidden User Access'})
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

        //cart 
        app.post('/users',async(req,res)=>{
            const userInfo = req.body;
            const query = {email:userInfo.email}
            const existingUsers = await userCollection.findOne(query)
                if(existingUsers){
                    return res.send({"message":"user already exists"})
                }
            const result = await userCollection.insertOne(userInfo)
            res.send(result)
        })

        app.get('/users',async(req,res)=>{
            const result = await userCollection.find({}).toArray()
            res.send(result)
        })

        app.patch('/users/admin/:id',async(req,res)=>{
            const id = req.params.id
            const filter = {_id:new ObjectId(id)}
            const updateDoc = {
                $set:{
                    role:'admin'
                }
            }
            const result = await userCollection.updateOne(filter,updateDoc)
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