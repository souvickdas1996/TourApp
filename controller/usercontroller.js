const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../config/config');
const User = require('../model/user');


const securePassword = (password)=>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    return hash;
}



const index = (req,res)=>{
    res.render('index')
}

const contact = (req,res)=>{
    res.render('contact', {
         message2: req.flash('message2'),
        data: User.find(),
        message2:req.flash("message2")
    })
}

const register_create =(req,res)=>{
    const{name,email,password} = req.body;
    const newPassword = securePassword(password)
    const userModel = new User({
        name:name,
        email:email,
        password:newPassword
    })
    userModel.save()
    .then(
        data =>{
            req.flash('message1',"register successfully ")
            res.redirect('/redirect');
        }
    )
    .catch(err=>{
        req.flash('message2',"user registration failed");
        res.rdirect('/contact');
    })
}

const login = (req,res)=>{
    const loginData = {};
    if (req.cookie){
        loginData.email = req.cookie.email || undefined;
        loginData.password =req.cookie.password || undefined;
    }

    res.render('contact',{
        message1:req.flash('message1'),
        message2:req.flash('message2'),
        data: loginData
    })
}

const loginCreate = (req,res)=>{
    User.findOne({email:req.body.email})
    .then(data =>{
        if(data){
            const hashPassword = data.password;
            if(bcrypt.compareSync(req.body.password, hashPassword)){
                const token = jwt.sign({
                    id:data._id,
                    name:data.name
                },verify.secret_key,{expiresIn: "30m"});
                res.cookie("userToken", token);
                if(req.body.rememberme){
                    res.cookie("email",req.body.email);
                    res.cookie("password",req.body.password);
                }
                console.log("login successfull",data);
                res.redirect('/tour');
            }else{
                req.flash('message2',"Incorrect password");
                res.redirect('/contact');
            }
            
        }else{
            req.flash("message2","No user found please try with anothe email or register first")
            res.redirect('/contact')
        }
    })
    .catch(err =>{
        console.log("login create",err);
    })
}

const logout =(req,res)=>{
    res.clearCookie("userToken");
    res.redirect('/contact')
}


const about = (req,res)=>{
    res.render('about')
}
const tour = (req,res)=>{
    res.render('tours')
}

const redirect = (req,res)=>{
    res.render('redirectpage')
}

const redirect2 = (req,res)=>{
    res.render('redirectpage2')
}

const payment = (req,res)=>{
    res.render('payment')
}
module.exports = {
    index,contact,register_create,login,loginCreate,logout, about,tour,redirect,redirect2,payment
}