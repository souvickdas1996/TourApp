const express = require('express');
const ejs = require('ejs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose = require('mongoose');
const userAuth = require('./middleware/userAuth')
const adminAuth = require('./middleware/adminAuth')
const port = 2004
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(flash())
app.use(cookie())
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false,
}));

app.set('view engine','ejs')
app.set('views','views')

app.use(express.static(path.join(__dirname,"public")))
app.use(express.static(path.join(__dirname,"views")))

app.use(userAuth.userjwt)
app.use(adminAuth.adminjwt)

const route = require('./router/userweb')
app.use(route)

const adminRoute = require('./router/adminweb')
app.use(adminRoute)

const dbDriver = "mongodb+srv://souvickdas:Wu2xcQJgYIswpXfL@cluster0.jqfnjyb.mongodb.net/_AMEN";
mongoose.connect(dbDriver,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    app.listen(port,()=>{
        console.log('db connect');
        console.log(`server running port http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log(err);
})


