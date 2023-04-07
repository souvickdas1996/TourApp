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

route.get("/admin/booking", controller.authadmin,controller.booking);
route.get("/admin/tourscms", controller.authadmin,controller.tourCMS);
route.post('/admin/updatetourcms',controller.updatetourCMS)
route.get("/admin/showtourscms", controller.authadmin,controller.showtourCMS);
route.get("/admin/edittourscms/:id", controller.authadmin,controller.edittourCMS);



module.exports = route