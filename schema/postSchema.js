const mongoose = require('mongoose')

const { Schema } = mongoose

const PostSchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength:150
    },
    body: {
        type: String,
        minlength: 4,
        maxlength:1500
    },
    photo: {
        type: Buffer,
        contentType:String
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },
    created: {
        type: Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Post",PostSchema)