const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    company: String,
    jobTitle:String,
    category: String,
    jobType: String,  // Full time, Contract, Internship
    salaryRange: String,
    applyLink: String,
    remote: Boolean,
    country: String,
    city: String,
    email:String,
    website:String,
    linkedin:String,
    description:String,
    createdDate: { type: Date, default: Date.now }
});

const Post = mongoose.model('job', postSchema);

module.exports = Post;



