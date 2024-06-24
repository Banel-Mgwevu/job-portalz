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

//==========================For===main======page===============================================
app.get('/', async (req, res) => {
  try {
    // Fetch the latest 10 jobs sorted by creation date in descending order
    const jobs = await Post.find().sort({ created_date: 1 }).limit(1);
    res.render('all-jobs/home', { jobs }); // Render EJS template with fetched jobs
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get('/alljobs', async (req, res) => {
    try {
      // Fetch all jobs sorted by creation date in descending order
      const jobs = await Post.find().sort({ created_date: -1 });
      
      // Render EJS template with fetched jobs
      res.render('all-jobs/home', { jobs });
    } catch (err) {
      // Send a 500 status code and error message if something goes wrong
      res.status(500).send(err.message);
    }
  });


//==============================================================================================================
//============================subscribe=========================================================================
app.get('/sub', (req, res) => {
   
    res.render('sub');
});

app.post('/sub', (req, res) => {  //Get the email for the news letter
   
    
});
//===============================================================================================================

app.get('/terms', (req, res) => {
   
    res.render('terms');
});

app.get('/privacy', (req, res) => {
   
    res.render('privacy');
});

app.get('/jobs', async (req, res) => {
    try {
        // Retrieve filter parameters from the query string
        const { category, jobType, remote } = req.query;

        // Create a query object to filter jobs
        let query = {};
        if (category) query.category = category;
        if (jobType) query.jobType = jobType;
        if (remote) query.remote = remote === 'true';

        // Fetch jobs based on the query object
        const jobs = await Post.find(query).sort({ created_date: -1 });

        res.render('jobs', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
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
      res.render('jobs', { jobId,job });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.post('/apply/:id', async (req, res) => {
    try {
        // Extract the ID from the request parameters
        const jobId = req.params.id;

        // Find the job post by ID
        const job = await Post.findById(jobId);

        // Check if the job post exists
        if (!job) {
            return res.status(404).send('Job post not found');
        }

        // Send a JSON response with the applyLink
        res.json({ applyLink: job.applyLink });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send('Server error');
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

//=================================fulltime========================================================
app.get('/FullTime', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Full-Time" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/All-fulltime', async (req, res) => {
    try {
      // Fetch all jobs with category "Full-Time" sorted by creation date in descending order
      const jobs = await Post.find({ jobType: "Full-Time" }).sort({ created_date: -1 });
      
      // Render EJS template with fetched jobs
      res.render('home', { jobs });
    } catch (err) {
      // Send a 500 status code and error message if something goes wrong
      res.status(500).send(err.message);
    }
  });

//===================================================================================================

//==========================part-time===============================================================
app.get('/Part-Time', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Part-Time" }).sort({ created_date: -1 }).limit(10);
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/All-Part-Time', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Part-Time" }).sort({ created_date: -1 }); //center and centre
        res.render('home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//===================================================================================================================

//================Contract===========================================================================================
app.get('/Contract', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Contract" }).sort({ created_date: -1 }).limit(10);
        res.render('contract/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/All-Contract', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Contract" }).sort({ created_date: -1 });
        res.render('contract/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//=============================================================================================================



//================Temporary======================================================================================
app.get('/Temporary', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Temporary" }).sort({ created_date: -1 }).limit(10);
        res.render('temporary/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.get('/All-Temporary', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ jobType: "Temporary" }).sort({ created_date: -1 });
        res.render('temporary/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//============================================================================================================


app.get('/remote-jobs', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ remote: true }).sort({ created_date: -1 }).limit(10);
        res.render('remote/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get('/all-remote-jobs', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ remote: true }).sort({ created_date: -1 });
        res.render('remote/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});




//FILTER CONTRACT

//******************************************************************************************************************************************** */

app.get('/education', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Education" }).sort({ created_date: -1 }).limit(10);
        res.render('education/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get('/all-education', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Education" }).sort({ created_date: -1 });
        res.render('education/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//===========================================================================================================

//=====================finance=============================================================================
app.get('/finance', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Finance" }).sort({ created_date: -1 }).limit(10);
        res.render('finance/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.get('/all-finance', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Finance" }).sort({ created_date: -1 });
        res.render('finance/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//===============tech============================================================================
app.get('/tech', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Tech" }).sort({ created_date: -1 }).limit(10);
        res.render('tech/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/all-tech', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Tech" }).sort({ created_date: -1 }).limit(10);
        res.render('tech/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//================healthcare====================================================================
app.get('/healthcare', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Healthcare" }).sort({ created_date: -1 }).limit(10);
        res.render('healthcare/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get('/all-healthcare', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Healthcare" }).sort({ created_date: -1 }).limit(10);
        res.render('healthcare/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//=================================================================================================================

app.get('/construction', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Construction" }).sort({ created_date: -1 }).limit(10);
        res.render('construction/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/all-construction', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Construction" }).sort({ created_date: -1 }).limit(10);
        res.render('construction/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//===========================================other======================================================
app.get('/other', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Other" }).sort({ created_date: -1 }).limit(10);
        res.render('other/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/all-other', async (req, res) => {
    try {
        // Fetch the latest 10 jobs with category "main" sorted by creation date in descending order
        const jobs = await Post.find({ category: "Other" }).sort({ created_date: -1 });
        res.render('other/home', { jobs }); // Render EJS template with fetched jobs
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//====================================================================

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
