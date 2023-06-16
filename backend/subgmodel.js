import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mySub = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    numMembers: {
        type: Number,
        required: true
    },
    numPosts:{
        type: Number,
        required: true
    },
    posts: [],
    members: [],
    pending: [],
    banned: [],
    tags: [],
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    bannedUsers: [],
    bannedPosts: [],
    reports: [],
    returnings: [],
});


export default mongoose.model("mySub",mySub);
