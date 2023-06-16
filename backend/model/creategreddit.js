import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MygredUser = new Schema({

    uniquename :{
        type : String,
    },

    name :{
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    bannedKeywords : {
        type : String,
    },
    members: {
        type: Array,
    },
    pendingMembers: {
        type: Array,
    },
    bannedMembers: {
        type: Array,
    },
    image : {
        type:String,
    },
    Id:
    {
        type:String
    }
});

export default mongoose.model("MygredUser" , MygredUser);
