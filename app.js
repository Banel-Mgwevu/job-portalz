const express = require('express');
const path = require('path');
const app = express();
const port = 3000; 
const Post = require('./models/post')
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = "mongodb+srv://earlearlpearl2:U57SUzInJ7tpffol@cluster0.ww6xjbx.mongodb.net/jobposts?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true,})
.then((result)=> app.listen(port)).catch((console.log('Error in connection')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Route for the root URL '/'
app.get('/', async(req, res) => {
    
    try {
        const jobs = await Post.find();
        res.render('home', { jobs }); // Render EJS template with fetched jobs
      } catch (err) {
        res.status(500).send(err.message);
      }
    
   
});

app.get('/sub', (req, res) => {
   
    res.render('sub');
});

app.post('/sub', (req, res) => {  //Get the email for the news letter
   
    
});

app.get('/terms', (req, res) => {
   
    res.render('terms');
});

app.get('/privacy', (req, res) => {
   
    res.render('privacy');
});

app.get('/jobs', (req, res) => {
    res.render('jobs');
});

// Assuming you have an Express app instance named 'app'
app.get('/apply/:id', (req, res) => {
    
    const userId = req.params.id; // Access the ID from the URL parameters
    // Perform actions with the specific user ID
    // This is a placeholder; you can fetch data, process, or perform any necessary logic here
    res.send(`Requested user ID: ${userId}`);

});
  







//******************************************************************************************************************************************** */
app.get('/job', async (req, res) => {
    try {
  
    
        // Create a new post based on the 'Post' model schema
        const newPost = new Post({
            company: 'Company',
            jobTitle: 'Jobs New HERE',
            category: 'Developer',
            fieldType: 'IT DevOPER',
            country: 'AfrIKA',
            city: 'PTA',
                });

        // Save the new post to the database
    //    const savedPost = await newPost.save();

        res.status(201).json(savedPost); // Respond with the saved post data as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); // Handle error if saving data fails
    }
});

app.get('/all',(req,res)=>{
    Post.find().then((result)=>{
        res.send(result);
    }).catch((err=>{
        console.log(err);
    }))
})

app.get('/allid',(req,res)=>{
    Post.findById('65968db6e4e8b2e0638849b7').then((result)=>{
        res.send(result);
    }).catch((err=>{
        console.log(err);
    }))
})


//run().catch(console.dir);

// Start the server


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
