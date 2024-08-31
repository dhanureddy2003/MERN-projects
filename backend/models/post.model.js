import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    text : {
        type : String,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    time : {
        type : Date,
        default : Date.now
    }
})

export const Comment = mongoose.model('Comment',commentSchema)

const postSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    img : {
        type : String,
    },
    text : {
        type : String,
        required : true
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    comments : [commentSchema]
},{timestamps:true})

export const Post = mongoose.model('Post',postSchema)