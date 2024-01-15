const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsShema = new Schema({

    company: String,
    jobTitle: String,
    category: String,
    fieldType: String,
    country: String,
    city: String,
    remote: Boolean,
    url: String,
    desc: String,
    cEmail:String,
  //  logo:Image,
    url2:String,
    // job_types: [String],
    // location: String,
    // created_at: Number

},
{timestamps:true});

const Post = mongoose.model('job',postsShema);
module.exports = Post;