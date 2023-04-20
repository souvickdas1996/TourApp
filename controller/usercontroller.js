const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../config/config');
const Tverify = require('../middleware/tourVerify');
const nodemailer = require('nodemailer');
const Comment = require('../model/comment');
const User = require('../model/user');
const Payment = require('../model/payment')
const Tour = require('../model/tourcms')


const securePassword = (password)=>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    return hash;
}

const verifymail = (email,name,userModel_id)=>{
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user: "shrutiranjanmaji35@gmail.com",
            pass: "pfscfpnnidshatdo"
        }
    })

    const mailoption = {
        from:"shrutiranjanmaji35@gmail.com",
        to:email,
        subject:'email verification',
        html:`<p>Hi ${name} <a href="http://localhost:2004/verify?id=${userModel_id}">LogIn</a> </p>`
    }

    transporter.sendMail(mailoption,((err)=>{
        if (err) {
            console.log("Techniclal Issue...");
        }
        else {
            req.flash("message", "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...")
    }

}))
}


const index = (req,res)=>{
    Tour.aggregate([{$sort:{serialno:-1}},{$limit:3}]).then((data) => {
        res.render('index', {
            title:"Index Page",
            tourdata:data
        })
        
    }).catch((err) => {
        console.log(err);
    });
        
    }

const contact = (req,res)=>{
    res.render('contact', {
        title:"Contact Page",
        data: User.find(),
        message1:req.flash("message1"),
        message2: req.flash("message2"),
        message3:req.flash("message3")
    })
}


const userdashboard = (req, res) => {
    if (req.user) {
        User.find().then((userdetails) => {
            if (userdetails) {
                res.render('userdashboard', {
                    title:"UserDashboard Page",
                    data:req.user,
                    udata:userdetails, 
                })
            }
            else{
                console.log("no data found");
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render('userdashboard', {
            data:User.find()
        })
    }
};


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
            req.flash('message1', "Register Done, check your email ");
            verifymail(email,name,userModel._id)
            res.redirect('/contact');
        }
    )
    .catch(err=>{
        req.flash('message2',"User Registration Failed");
        res.rdirect('/contact');
    })
}

const verifying = (req,res)=>{

    User.updateOne({_id:req.query.id},{$set:{is_Verify:1}}).then((result) => {
       res.render('verify')
    }).catch((err) => {
       log(err)
    });
   }

const login = (req,res)=>{
    const loginData = {};
    if (req.cookie){
        loginData.email = req.cookie.email || undefined;
        loginData.password =req.cookie.password || undefined;
    }

    res.render('contact', {
        title:"Contact Page",
        
        message3:req.flash('message3'),
        data: loginData
    })
}

const loginCreate = (req,res)=>{
    User.findOne({email:req.body.email})
    .then(data =>{
        if(data.is_Verify){
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
    Comment.aggregate([{$sort:{createdAt:-1}},{ $limit: 5 }]).then((data) => {
        res.render('about', {
            title: "About Page",
            commentdata: data
        })
        
    }).catch((err) => {
        console.log(err);
    })
}


const viewcmnt = (req, res) => {
   Comment.aggregate([{$sort:{createdAt:-1}},{ $limit: 5 }]).then((data) => {
        res.render('about', {
            title: "About Page",
            commentdata: data
        })
        
    }).catch((err) => {
        console.log(err);
    })
}



const comment =(req,res)=>{
    console.log(req.body);
    const{name,email,comment,createdAt}=req.body
    const commentmodel = new Comment({
        name:name,
        email:email,
        comment:comment,
        createdAt:createdAt
    })

    commentmodel.save().then((result) => {
        res.redirect('/about')
    }).catch((err) => {
        console.log(err);
        res.redirect('/')
    });
}




const tour = (req,res)=>{
   Tour.find().then((data) => {
       res.render('tours', {
        title:"Tour Page",
        maintourdata:data
    })
   }).catch((err) => {
    console.log(err);
   });
}

const redirect =(req,res)=>{
    const id = req.params.id
    Tour.findById(id).then((data) => {
        res.render('redirectpage', {
            title:"Redirect Page",
            redirectdata:data

        })
    }).catch((err) => {
        console.log(err);
        res.render('index')
    });
    }

const redirect2 =(req,res)=>{
    const id = req.params.id
    Tour.findById(id).then((data) => {
        res.render('redirectpage2', {
            title:"Redirect Page2",
            redirectdata2:data

        })
    }).catch((err) => {
        console.log(err);
        res.render('index')
    });
    }


const payment = (req,res)=>{
    if (req.user) {
        User.find().then(()=>{
            res.render('payment', {
                message4: req.flash('message4'),
                message5: req.flash('message5'),
                message6:req.flash('message6')
             })
        })
    } else {
        console.log(err);
    }
}

const paymentData = (req,res)=>{
    console.log('booking details',req.body);
    const paymentmodel = new Payment({
        name:req.body.name,
        email:req.body.email,
        startingdate: req.body.startingdate,
        endingdate:req.body.endingdate,
        packagename:req.body.packagename,
        personcount:req.body.personcount,
    })
    const sendmail = (email,name)=>{
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
        user: "shrutiranjanmaji35@gmail.com",
            pass: "pfscfpnnidshatdo"
        }
    })

    const mailoption = {
        from:"shrutiranjanmaji35@gmail.com",
        to:email,
        subject:'Booking Confirmation',
        text:"Congratulations "+ req.body.name +" !!!You have successfully booked tickets to "+req.body. packagename+ " for "+req.body.personcount+" persons from "+req.body.startingdate+" to "+req.body.endingdate+". We wish your safe and comfortable journey."
    }

    transporter.sendMail(mailoption,((err)=>{
        if (err) {
            console.log("Techniclal Issue...");
        }
        else {
            req.flash("message", "A Verfication Email Sent To Your Mail ID..")
    }

}))
}
  paymentmodel.save().then((result) => {
      req.flash('message4', 'Booking Done')
      sendmail(req.body.email,req.body.name)
        res.redirect('/payment')
    }).catch((err) => {
        req.flash('message4','Error')
        res.redirect('/')
        console.log(err);
    });
}

const bookingdetails = (req, res) => {
    Payment.find().populate('user').then((data) => {
        Payment.aggregate([{ $match: { name: req.user.name } }]).then(data => {
            if (data) {
                res.render('bookingdetails', {
                    title: "BookingDetails Page",
                    data: req.user,
                    bookingdata: data
                })
            }
        }).catch(err => {
            console.log(err)
        })
        
        } )
    }

const authuser = (req,res,next)=>{
    if (req.user) {
        console.log(req.user);
        next()
    } else {
        res.redirect('/contact')
    }
}

module.exports = {
    index,contact,userdashboard, register_create,login,loginCreate,logout, about,tour,redirect,redirect2,payment,paymentData, bookingdetails, authuser,

    viewcmnt,comment,verifying
}