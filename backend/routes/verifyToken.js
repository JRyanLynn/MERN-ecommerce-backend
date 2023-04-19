const jwt = require('jsonwebtoken');

//jwt verify middleware
const verifyToken = (req, res, next) => {
    //token here
    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            //403 code for invalid token
            if (err) res.status(403).json('Token not valid')
            req.user = user;
            next();
        })
    } 
    //401 means user not authenticated
    else {
        return res.status(401).json('You are not authenticated')
    }
} 

//verify token middleware
const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        //lets user in 
        if(req.user.id === req.params.id || req.user.isAdmin) { 
            next();    
        } else {
            //403 code means that server works but auth not good
            res.status(403).json('Access denied')
        }
    });
};

//Verify admin 
const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //lets user in 
        if(req.user.isAdmin) { 
            next();    
        } else {
            //403 code means that server works but auth not good
            res.status(403).json('Access denied')
        }
    });
};

module.exports = {verifyToken, verifyTokenAuth, verifyTokenAdmin}