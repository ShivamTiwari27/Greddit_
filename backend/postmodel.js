import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const posts = new Schema({
    title: {
        type: String,
        required: true
    },
    subname: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    upvotes: {
        type: Array,
        required: true
    },
    downvotes: {
        type: Array,
        required: true
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: Array,
        required: true
    }
});


export default mongoose.model("posts",posts);
