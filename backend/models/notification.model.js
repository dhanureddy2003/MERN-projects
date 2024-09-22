import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    read : {
        type : Boolean,
        default : false
    },
    type : {
        type : String,
        required : true,
        enum : ['like', 'follow', 'comment']
    }   
},{timestamps:true})

export const Notification = mongoose.model('Notification',notificationSchema)