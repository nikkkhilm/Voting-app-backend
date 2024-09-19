
const jwt = require('jsonwebtoken');

function authuser(req,res,next)
{
    const authorization = req.headers.authorization;
    if(!authorization)
    {
       return res.status(401).send("Token not found");
    }
    const token = authorization.split(' ')[1];
    try {
        
        const decoded = jwt.verify(token,process.env.SECRET);
        req.user=decoded;
        // here above we are adding for user key decoded value i.e user id which we encoded in jwt while sending from frontend
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({error:"invalid token"});
    }
    
}

module.exports = authuser;