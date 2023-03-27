const express = require('express');
const route = express.Router()
const controller = require('../controller/usercontroller')
const verify = require('../middleware/userVerify');

route.get('/',controller.index)
route.get('/contact', controller.contact);
route.post('/register/create', [verify.duplicateVerify], controller.register_create);
route.get('/login', controller.login);
route.post('/login/create', controller.loginCreate);
route.get('/logout', controller.logout);
route.get('/tour',controller.tour)
route.get('/about',controller.about)
route.get('/redirect',controller.redirect)
route.get('/redirect2',controller.redirect2)
route.get('/payment',controller.payment)

module.exports = route