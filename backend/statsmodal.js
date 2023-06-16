import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const myStats = new Schema({
    subname: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("myStats",myStats);
