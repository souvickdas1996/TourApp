const Admin = require('../model/admin');
const user = require('../model/user');
const Booking = require('../model/payment')
const Tour = require('../model/tourcms')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../config/config')
const createPassword = (password)=>{

    const salt = bcrypt.genSaltSync(10)
    const hasspassword = bcrypt.hashSync(password,salt)
    return hasspassword
}

const create = (req,res)=>{
    res.render('adminlogin', {
        title:"AdminLogin Page",
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

    res.render('adminform', {
        title:"AdminForm Page",
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
                res.render('adminDashboard', {
                    title:"AdminDashboard Page",
                    admindata:req.admin,
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

const users = (req,res)=>{
    user.find().then(result=>{
        res.render("users", {
           title:"Users Page",
           displayData:result
       })
    }) .catch(err=>{
       console.log(err);
    })  
   }
   


const deleteUser = (req, res) => {
    user.findByIdAndRemove(req.params.id, {status:0})
    .then(result => {
         console.log("User Deleted...");
         res.redirect("/admin/users");
    }).catch(err => {
        console.log(err);
        res.redirect("/admin/users");
    })
}


const reviews = (req,res)=>{
    if (req.admin) {
        Admin.find().then((admindetails) => {
            if (admindetails) {
                res.render('reviews', {
                    title:"Review Page",
                    admindata:req.admin,
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

const booking = (req,res)=>{
    Booking.aggregate([{$sort:{startingdate:-1}}]).then((data) => {
        res.render('bookinghistory', {
            title:"BookingHistory Page",
            bookingdata:data
        })
    }).catch((err) => {
        console.log(err);
    });
}

const tourCMS = (req,res)=>{
    res.render('toursCMS', {
        title:"ToursCMS Page"
    })
}

const updatetourCMS = (req,res)=>{
    console.log("tour cms data",req.body);

        const{ placename,sidename,description,startingdate,duration,price,personcount,ourtourdescription,redirectdescription,ttDestination,ttprice,ttdescription,serialno,Timage,TBimage,TS1image,TS2image,TS3image,TS4image,TRmage,RBimage,RS1image,RS2image,RS3image,RS4image } = req.body

    const tourmodel = new Tour({
        placename:placename,
        sidename:sidename,
        description:description,
        startingdate:startingdate,
        duration:duration,
        price:price,
        personcount:personcount,
        ourtourdescription:ourtourdescription,
        redirectdescription:redirectdescription,

        
        TRmage:TRmage,
        RBimage:RBimage,
        RS1image:RS1image,
        RS2image:RS2image,
        RS3image:RS3image,
        RS4image:RS4image,

        ttDestination:ttDestination,
        ttprice:ttprice,
        ttdescription:ttdescription,
        serialno:serialno,
        image:req.file.filename,
        Timage:Timage,
        TBimage:TBimage,
        TS1image:TS1image,
        TS2image:TS2image,
        TS3image:TS3image,
        TS4image:TS4image
    })

    tourmodel.save().then((result) => {
        res.redirect('/admin/showtourscms')
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/tourscms')
    });
}

const showtourCMS = (req,res)=>{
    Tour.find().then((data) => {
        res.render('showtoursCMS', {
            title:"ShowTourCMS Page",
            tourcmsdata:data
        })

    }).catch((err) => {
        console.log(err);
    });
}

const edittourCMS = (req,res)=>{
    const id = req.params.id
    Tour.findById(id).then((data) => {
        res.render('edittourCMS', {
            title:"EditTourCMS Page",
            edata:data
        })
        
    }).catch((err) => {
        console.log(err);
    });
}

const editupdatetourCMS = (req,res)=>{
const s_id = req.body.s_id
const placename= req.body.placename
const sidename= req.body.sidename
const description= req.body.description
const startingdate= req.body.startingdate
const duration= req.body.duration
const price= req.body.price
const personcount= req.body.personcount
const ourtourdescription= req.body.ourtourdescription
const redirectdescription= req.body.redirectdescription



const TRmage = req.body.TRmage
const RBimage = req.body.RBimage
const RS1image= req.body.RS1image
const RS2image= req.body.RS2image
const RS3image= req.body.RS3image
const RS4image= req.body.RS4image

const ttDestination= req.body.ttDestination
const ttprice= req.body.ttprice
const ttdescription= req.body.ttdescription
const serialno= req.body.serialno
const image=req.file.filename
const Timage=req.body.Timage
const TBimage=req.body.TBimage
const TS1image=req.body.TS1image
const TS2image=req.body.TS2image
const TS3image=req.body.TS3image
const TS4image=req.body.TS4image


Tour.findById(s_id).then((result) => {
    result.placename=placename,
    result.sidename=sidename,
    result.description=description,
    result.startingdate=startingdate,
    result.duration=duration,
    result.price=price,
    result.personcount=personcount,
    result.ourtourdescription=ourtourdescription,
    result.redirectdescription=redirectdescription,

   
    result.TRmage=TRmage,
    result.RBimage=RBimage,
    result.RS1image=RS1image,
    result.RS2image=RS2image,
    result.RS3image=RS3image,
    result.RS4image=RS4image,

    result.ttDestination=ttDestination,
    result.ttprice=ttprice,
    result.ttdescription=ttdescription,
    result.serialno=serialno,
    result.image=req.file.filename
    result.Timage=Timage
    result.TBimage=TBimage
    result.TS1image=TS1image
    result.TS2image=TS2image
    result.TS3image=TS3image
    result.TS4image=TS4image

    return result.save().then((results) => {
        res.redirect('/admin/showtourscms')
    }).catch((err) => {
        console.log(err);
    });
})
}

module.exports = {
    create,data,login,update,authadmin,dashboard,logout,booking,tourCMS,updatetourCMS,showtourCMS,edittourCMS,editupdatetourCMS,

reviews,users,deleteUser,
//activeUser
}