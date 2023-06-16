import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    password: String,
    fname: String,
    lname: String,
    email: String,
    age: String,
    contact: String,
    followers: Array,
    following: Array,
    savedPosts: Array,
});



export default mongoose.model("User",User);
