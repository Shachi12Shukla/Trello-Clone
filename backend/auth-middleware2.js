const jwt = require("jsonwebtoken");
require('dotenv').config();


function authMiddleware(req,res,next){

    const token = req.headers.token;
    
    if(!token){
        // user is trying to login using in-cognito window
        res.status(403).send("you are not logged in");
        return;
    }
    
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.userId;
    
    if(!userId){
        res.status(403).send("malformed token");
        return;
    };
    

    req.userId = userId;  
    next();

}

module.exports = {
    authMiddleware
}