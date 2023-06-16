import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const myChat = new Schema({
    u1: {
        type: String,
        required: true
    },
    u2: {
        type: String,
        required: true
    },
    messages: [
{
        sender: {
            type: String,
            required: true
        },
        receiver: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
}
    ],
    date: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model("myChat",myChat);
