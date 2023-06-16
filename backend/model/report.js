
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Report = new Schema({

    PostId : {
        type : String,
    },

    Reported_By: {
        type: String,
    },

    Reported_whom: {
        type: String,
    },

    Concern: {
        type: String,
    },

    Textofpost : {
        type : String,
    }
});


export default mongoose.model("Report", Report);


