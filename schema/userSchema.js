const mongoose = require('mongoose')
const uuidv1 = require('uuid/v1')
const crypto = require('crypto');

const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required:true
    },
    email: {
        type: String,
        trim: true,
        required:true
    },
    hashed_password: {
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String 
    },
    about: {
        type: String,
        trim:true
    },
    salt: String,
    created: {
        type: Date,
        default:Date.now
    },
    updated: Date,
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })
UserSchema.methods = {
    authenticate: function (plaintext) {
      return this.encryptPassword(plaintext)===this.hashed_password
    },
    encryptPassword:function (password) {
        if (!password) return "";
        try {            
            return crypto
                .createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
            
        }
        catch (err) {
            return ""
        }
    }
}


module.exports=mongoose.model("User",UserSchema)