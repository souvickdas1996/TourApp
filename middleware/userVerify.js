const User = require("../model/user");

exports.duplicateVerify = (req,res,next)=>{
    User.findOne({email:req.body.email})
    .then(data =>{
        if(data){
            req.flash("message2","Email Already Exists")
            return res.redirect('/contact')
        }
        const {name,email,password,cpassword}=req.body ;
        if(!(name && email && password && cpassword)){
            req.flash("message2","All Inputs Are Required");
            return res.redirect('/contact');
        }
        
        if(password !== cpassword){
            req.flash("message2","Mismatched Password");
            return res.redirect('/contact');
        }

        next()
    })
    .catch(err =>{
        console.log(err);
        next();
    })
}