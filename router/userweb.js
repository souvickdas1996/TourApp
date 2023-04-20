const express = require('express');
const route = express.Router()
const controller = require('../controller/usercontroller')
const verify = require('../middleware/userVerify');
const Tverify = require('../middleware/tourVerify');
const Cverify = require('../middleware/commentVerify');

route.get('/',controller.index)
route.get('/contact', controller.contact);
route.get('/verify', controller.verifying);
route.get('/userdashboard', controller.userdashboard);
route.post('/register/create', [verify.duplicateVerify], controller.register_create);
route.get('/login', controller.login);
route.post('/login/create', controller.loginCreate);
route.get('/logout', controller.logout);
route.get('/tour', controller.tour);
route.get('/about', controller.about);


route.get("/viewcmnt", controller.viewcmnt);
route.post('/comment', [Tverify.duplicateVerify], controller.authuser, controller.comment);



route.get('/redirect/:id', controller.redirect);
route.get('/redirect2/:id', controller.redirect2);
route.get('/payment', controller.authuser, controller.payment);
route.get('/bookingdetails',controller.authuser,controller.bookingdetails);
route.post('/paymentdata', [Cverify.fakeVerify], controller.paymentData);

module.exports = route