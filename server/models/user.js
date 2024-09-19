const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
{
    username:{
        type:String,
        required:true
    },
    adharnum:{
         type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['voter','admin'],
        default:'voter'
    },
    isvoted:{
        type:Boolean,
        default:false
    }
});

UserSchema.pre('save',async function(next){
    
    if(!this.isModified('password'))
    {
        return next();
    }

    try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password,salt);
            next();

    } catch (error) {
        return next(error);
    }

    
})
const user = mongoose.model('user',UserSchema);


module.exports = user;