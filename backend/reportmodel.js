import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const myReport = new Schema({
    reporter: {
        type: String,
        required: true
    },
    reported: {
        type: String,
        required: true
    },
    subname: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    }
});


export default mongoose.model("myReport",myReport);
