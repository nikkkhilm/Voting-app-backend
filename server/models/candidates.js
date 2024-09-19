const mongoose = require('mongoose');
const user = require('./user')

const candidateSchema = new mongoose.Schema(
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
    partyname:{
        type:String,
        required:true
    },
    // all others above stores objects
    // votes -> array of objects it stores
    votes:[{
        user:
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
        // required:true,
        },
        votedat:
        {
            type:Date,
            default:Date.now()
        }
    }],
    votecount:{
        type:Number,
        default:0
    }
});

const candidate = mongoose.model('candidate',candidateSchema);

module.exports = candidate;