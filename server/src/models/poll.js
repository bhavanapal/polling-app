import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    question:{
        type: String,
        required:true,

    },
    options:[
        {
            option:{
                type:String,
                required:true,
            },
            votes:{
                type:Number,
                 default:0,
            },
        },
    ],
    // track who voted(to prevent duplicate)
    voters:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        },
    ],
    // who created poll(admin)
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    // Poll status
    isActive:{
        type:Boolean,
        default:true,
    },
},{timestamps:true});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;

