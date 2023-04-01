const express = require('express');
const route = express.Router()
const controller = require('../controller/admincontroller')
const verify = require('../middleware/adminVerify')

route.get('/admin/create',controller.create)
route.post('/admin/save',[verify.duplicateVerify],controller.data)
route.get('/admin/login',controller.login)
route.post('/admin/update',controller.update)
route.get('/admin/dashboard',controller.authadmin,controller.dashboard)
route.get('/admin/logout',controller.logout)

route.get('/admin/users',controller.authadmin,controller.users)




route.get('/admin/logout',controller.logout)

route.get('/admin/dashboard/reviews',controller.authadmin,controller.reviews)

route.get("/admin/deleteuser/(:id)", controller.authadmin,controller.deleteUser);



module.exports = route