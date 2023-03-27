const jwt = require('jsonwebtoken');
const verify = require('../config/config')

exports.adminjwt = (req,res,next)=>{
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken,verify.secret_key,(err,data)=>{
            if (!err) {
                req.admin = data
                console.log(req.admin);
                next()
            } else {
                console.log("adminJwt",err);
                next()
            }
        })
    } else {
        console.log('admin cookie not found');
        next()
    }
}