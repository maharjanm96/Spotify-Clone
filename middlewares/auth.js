const jwt = require("jsonwebtoken");

module.exports=(req,res) =>{
    const token = req.header("x-auth-token");
    if(!token)
    return res.status(400).send({message:"Access denied, No Token Provided.0"});

    jwt.verify
}