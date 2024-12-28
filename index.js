const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_useName}:${process.env.DB_ProfileKey}@cluster0.epj76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )

    // creating data base
    const db = client.db('solodb');
    const jobCollection = db.collection('jobCollection');

    // posting new job
    app.post('/add-job', async (req, res) => {

      const newJob = req.body;
      console.log(newJob)
      const result = await jobCollection.insertOne(newJob);
      res.send(result);

    })
    // geting add job in the server
    app.get('/jobs', async (req, res) => {

      const result = await jobCollection.find().toArray();
      res.send(result);
    })

    // get a specific job using email 
    app.get('/jobs/:email', async (req, res) => {
      const email = req.params.email;
      // params --> when must (:email/:id) params - must pass korte hobe
      // query --> optional - pass korleo hoy, na korleo hoy
      const query = { 'buyer.email': email };
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    })

    // deleteing job-post from my-posted-job
    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })
    
    // get a single job data by id from db
    // app.get('/job/:id', async (req, res) => {
    //   const id = req.params.id
    //   const query = { _id: new ObjectId(id) }
    //   const result = await jobCollection.findOne(query)
    //   res.send(result)
    // })



  } finally {

  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
