const express = require('express'); //https://github.com/Banel-Mgwevu/job-portalz
const path = require('path');
const app = express();
const port = 3000; 
const Post = require('./models/post');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Subscriber = require('./models/subscriber');

const uri = "mongodb+srv://earlearlpearl2:U57SUzInJ7tpffol@cluster0.ww6xjbx.mongodb.net/jobposts?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }))
  .catch(err => console.log('Error in connection:', err));

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Route for the root URL '/'
app.get('/', async (req, res) => {
  try {
    // Fetch the latest 10 jobs sorted by creation date in descending order
    const jobs = await Post.find().sort({ created_date: -1 }).limit(10);
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

// Assuming you have an Express app instance named 'app'
app.get('/job/:id', async (req, res) => {
    const jobId = req.params.id; // Access the ID from the URL parameters
  
    try {
      // Find the job post by ID
      const job = await Post.findById(jobId);
  
      // Check if the job post was found
      if (!job) {
        return res.status(404).send('Job post not found');
      }
  
      // Render the 'jobs' template with the job data
      res.render('jobs', { job });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  
app.get('/post', (req, res) => {  //https://chatgpt.com/share/08ebf041-dcb5-4f14-be54-099b3a633597
   
    res.render('post');
});


app.get('/newsletter', (req, res) => {  
   
    res.render('newsletter');
});

app.get('/subscribe', (req, res) => {  
   
    res.render('subscribe');
});


app.post('/postjob', async (req, res) => {
    try {
        const {
            company, jobTitle, category, jobType, salaryRange, applyLink,
            remote, country, city, email, website, linkedin, description
        } = req.body;

        // Create a new post based on the 'Post' model schema
        const newPost = new Post({
            email: email,
            website: website,
            linkedin: linkedin,
            description: description,
            company: company,
            jobTitle: jobTitle,
            category: category,
            jobType: jobType,
            salaryRange: salaryRange,
            applyLink: applyLink,
            remote: remote === 'true',  // Assuming checkbox sends 'true' as a string
            country: country,
            city: city
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        res.status(201).json({message: 'saved to database', data: savedPost}); // Respond with the saved post data as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); // Handle error if saving data fails
    }
});




app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const newSubscriber = new Subscriber({ email });
      await newSubscriber.save();
      res.status(201).json({ message: 'Subscription successful' });
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        res.status(400).json({ error: 'Email already subscribed' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  });



//FILTERS CONTRACT================================
app.get('/FullTime', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Full-Time" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/Part-Time', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Part-Time" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/Contract', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Contract" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/Temporary', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Temporary" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//FILTER CONTRACT

//******************************************************************************************************************************************** */




app.get('/post', async (req, res) => {
   
    try {
  
    
        // Create a new post based on the 'Post' model schema
        const newPost = new Post({
            company: 'ciciccici',
            jobTitle: 'Jobs New HERE',
            category: 'Manager',
            fieldType: 'IT DevOPERer',
            country: 'AfrIKA',
            city: 'PTA',
            created_date: new Date()
                });

        // Save the new post to the database
        const savedPost = await newPost.save();

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
