const jwt = require('jsonwebtoken');


function authadmin(req,res,next)
{
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).send("Token not found");
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send("error in token authorization");
    }
};

module.exports = authadmin;