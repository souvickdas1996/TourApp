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
module.exports = route