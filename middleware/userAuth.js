const jwt = require('jsonwebtoken');
const verify = require('../config/config');

exports.userjwt = (req,res,next)=>{
    if (req.cookies && req.cookies.userToken) {
        jwt.verify(req.cookies.userToken,verify.secret_key,(err,data)=>{
            if (!err) {
                req.user = data
                console.log(req.user);
                next()
            } else {
                console.log("userJwt",err);
                next()
            }
        })
    } else {
        console.log('User cookie not found');
        next()
    }
}