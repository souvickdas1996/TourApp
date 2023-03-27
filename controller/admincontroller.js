const Admin = require('../model/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../config/config')

const createPassword = (password)=>{

    const salt = bcrypt.genSaltSync(10)
    const hasspassword = bcrypt.hashSync(password,salt)
    return hasspassword
}

const create = (req,res)=>{
    res.render('adminlogin',{
    message:req.flash('message'),
    data:Admin.find()
})
}

const data = (req,res)=>{
    console.log(req.body);
    const securePassword = createPassword(req.body.password)
    const adminData =new Admin({
        name:req.body.name,
        email:req.body.email,
        password:securePassword
    })
    adminData.save().then((result) => {
        req.flash('message','data saved successfully')
       return res.redirect("/admin/login")
    }).catch((err) => {
        req.flash('message','error occurd')
       return res.redirect("/admin/create")
    });
}


const login = (req,res)=>{
    
    let loginData = {}

    if (req.cookies) {

        loginData.email = req.cookies.email || undefined
        loginData.password = req.cookies.password || undefined
    }

    res.render('adminform',{
        message:req.flash('message'),
        data:loginData,
    })
}

const update = (req,res)=>{
    Admin.findOne({email:req.body.email}).then((data)=>{
        if (data) {
            const hasspassword = data.password
            if (bcrypt.compare(req.body.password,hasspassword)) {
                let token = jwt.sign({
                    id:data._id,
                    name:data.name
                },verify.secret_key,{expiresIn:"30m"})
                res.cookie("adminToken",token)
                if (req.body.remember) {
                    res.cookie('email',req.body.email)
                    res.cookie('password',req.body.password)
                }
                req.flash('message',"login successfully")
                res.redirect("/admin/dashboard")
                console.log(data); 
            } else {
                req.flash('message',"please enter proper password")
                res.redirect("/admin/login") 
            }
        } else {
          req.flash('message',"please enter proper email")
          res.redirect("/admin/login")  
        }
    })
}

const authadmin = (req,res,next)=>{
    if (req.admin) {
        console.log(req.admin);
        next()
    } else {
        res.redirect('/admin/login')
    }
}

const dashboard = (req,res)=>{
    if (req.admin) {
        Admin.find().then((admindetails) => {
            if (admindetails) {
                res.render('adminDashboard',{
                    data:req.admin,
                    details:admindetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

const logout = (req,res)=>{
    res.clearCookie('adminToken')
    res.redirect('/admin/login')
}

module.exports = {
    create,data,login,update,authadmin,dashboard,logout
}