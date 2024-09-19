const express=require('express');
const router=express.Router();
const authadmin = require('../Middleware/authadmin');
const user = require('../models/user');
const candidate = require('../models/candidates');
const authuser = require('../Middleware/authUser');


const checkrole = async (userid)=>{
    try{
    const User = await user.findById(userid);

    return User.role==="admin";
    }catch(error)
    {
        return false;
    }

}

router.post('/newcandidate',authadmin,async(req,res)=>{

    try {
        const {username,adharnum,partyname} = req.body;

    // for checking if user is admin or not
    const rolecheck = await checkrole(req.user.id);   
    if(!rolecheck)
    {
        return res.status(403).send("Not authorised to access");
    }



    if(!username || !adharnum || !partyname)
    {
        return res.status(404).send("All fields are required");
    }

    const newcandidate = new candidate({username,adharnum,partyname});

    const savedcandidate = await newcandidate.save();
    res.status(200).json({savedcandidate});
    } catch (error) {
        console.log(error);
         res.status(404).send("Error to add candidate");
    }
});


// all candidates
router.get('/',async(req,res)=>{
    try {
        const candidates = await candidate.find();
        res.status(200).json({candidates});
    } catch (error) {
        res.status(404).send("error fetching candidates");
    }
});

// vote count
router.get('/count',async(req,res)=>{
    try {
        const candidates = await candidate.find().sort({votecount:'desc'});

        const voterrecord = candidates.map((data)=>{
            return {
                party:data.partyname,
                votecount:data.votecount
            }
        })

        res.status(200).json(voterrecord);
    } catch (error) {
        res.status(404).send("error fetching candidates");
    }
});

router.put('/updatecandidate/:candidateid',authadmin,async(req,res)=>{
        try {
                const rolecheck = await checkrole(req.user.id);   
                if(!rolecheck)
                {
                    return res.status(403).send("Not authorised to access");
                }

                const updatedata = req.body;


                const candidateid = req.params.candidateid;

                const updatedcandidate = await candidate.findByIdAndUpdate(candidateid,{$set:updatedata},{new:true});

                if(!updatedcandidate)
                {
                     res.status(404).send("Error to update candidate");
                }
                  res.status(200).json({updatedcandidate});

        } catch (error) {
             res.status(404).send("error updating candidate");
        }
})

router.delete('/deletecandidate/:candidateid',authadmin,async(req,res)=>{
        try {
                const rolecheck = await checkrole(req.user.id);   
                if(!rolecheck)
                {
                    return res.status(403).send("Not authorised to access");
                }


                const candidateid = req.params.candidateid;

                if(!candidateid)
                {
                    return res.status(404).send("no matching candidate");
                }

                const response = await candidate.findByIdAndDelete(candidateid);

                if(!response)
                {
                     res.status(404).send("Error to delete candidate");
                }
                  res.status(200).json({response});

        } catch (error) {
             res.status(404).send("error deleting candidate");
        }
});


// voting
router.post('/:candidateid',authuser,async(req,res)=>{
        try {


                const userid = req.user.id;

                const rolecheck = await checkrole(userid);   
                if(rolecheck)
                {
                    return res.status(403).send("Admin cant vote");
                }
    

               const User = await user.findById(userid);

               if(!User)
               {
                return res.status(404).send("user not found");
               }

               if(User.isvoted)
               {
                return res.status(404).send("Already voted once");
               }


                const candidateid = req.params.candidateid;

                const curcandidate = await candidate.findById(candidateid);

                if(!curcandidate)
                {
                    return res.status(404).send("candidate not found");
                }
                
                // update user isvoted status
                // const updateduser = await user.findByIdAndUpdate(userid,{$set:{isvoted:true}},{new:true});

                // if(!updateduser)
                // {
                //      res.status(404).send("Error to update user status");
                // }
                User.isvoted=true;
                await User.save();
                
                // update the candidate votes array by pushing the voters id 
                // user is the key  and like that only u have to store as its mentioned in schema
                curcandidate.votes.push({user:userid});
                curcandidate.votecount++;
                await curcandidate.save();

                res.status(200).json({message:"vote recorded sucessfully"});

        } catch (error) {
             res.status(404).send("error voting candidate");
        }
});






module.exports = router
