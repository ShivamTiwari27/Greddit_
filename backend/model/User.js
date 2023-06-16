import mongoose from "mongoose";
const Schema = mongoose.Schema;



const User = new Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true,

    },

    Username: {
        type: String,
        required: true,
        unique: true,

    },

    age: {
        type: String,
        required: true
    },

    Contact: {
        type: String,
        required: true,
        length: 10,
    },

    email: {
        type: String,
        required: true,
    },

    Password: {
        type: String,
        required: true,
        minlength: 2,
    },

    City: {
        type: String,
        default: "",
    },

    hobby: {
        type: String,
        default: ""
    },

    Profession: {
        type: String,
        default: ""
    },

    follower: {
        type: Array,
    },

    following: {
        type: Array,
    },

    image: {
        type: String,
    },

    saveposts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});

//user add krna h na

export default mongoose.model("User", User);


