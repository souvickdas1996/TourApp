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
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('index',{
                    data:req.user,
                    details:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('index', {
            data:User.find()
        })
    }
}

const contact = (req,res)=>{
    res.render('contact', {
        data: User.find(),
        message1:req.flash("message1"),
        message2: req.flash("message2"),
        message3:req.flash("message3")
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
            req.flash('message1', "Register Done, Now LogIn ");
            res.redirect('/contact');
        }
    )
    .catch(err=>{
        req.flash('message2',"User Registration Failed");
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
        
        message3:req.flash('message3'),
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
                req.flash('message3',"Incorrect password");
                res.redirect('/contact');
            }
            
        }else{
            req.flash("message3", "No User found");
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
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('about',{
                    data:req.user,
                    details:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('about', {
            data:User.find()
        })
    }
}
const tour = (req,res)=>{
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('tours',{
                    data:req.user,
                    details:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('tours', {
            data:User.find()
        })
    }
}

const redirect =(req,res)=>{
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('redirectpage',{
                    data:req.user,
                    details:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('redirect', {
            data:User.find()
        })
    }
}

const redirect2 =(req,res)=>{
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('redirectpage2',{
                    data:req.user,
                    details:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('redirect2', {
            data:User.find()
        })
    }
}

const payment = (req,res)=>{
    res.render('payment')
}
module.exports = {
    index,contact,register_create,login,loginCreate,logout, about,tour,redirect,redirect2,payment
}