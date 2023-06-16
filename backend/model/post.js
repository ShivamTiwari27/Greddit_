import mongoose from "mongoose";
const Schema = mongoose.Schema;


const Comment = new Schema({
    text: {
        type: String,
    },
    commentedBy: {
        type:String,
    },
    commentedOn: {
        type: Date,
        default: Date.now
    }
});




const Post = new Schema({
    Text: {
        type: String,
    },

    Description: {
        type: String,
    },

    Posted_By: {
        type: String,
        required: true,

    },

    Posted_In: {
        type: String,
        required: true,
    },

    Upvotes: {
        type: Number,
        default: 0,

    },

    Downvotes: {
        type: Number,
        default: 0,
    },

    upvotesUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotesUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],


    comments: [Comment],



});

//user add krna h na

export default mongoose.model("Post", Post);


