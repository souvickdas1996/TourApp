const express = require('express');
const multer = require('multer');
const path = require('path');
const route = express.Router()
const controller = require('../controller/admincontroller')
const verify = require('../middleware/adminVerify')

route.use(express.static('upload'));
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, '../upload'),(error, success)=> {
            if (error) throw error;
        })
    },

    filename: (req, file, cb)=> {
        const name = Date.now() + '_' + path.extname(file.originalname) 
        cb(null, name, (error1, success1)=> {
            if (error1) throw error1
        })
    }

})

const upload = multer({ storage: storage });

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

route.post('/admin/updatetourcms',upload.single('image'),controller.updatetourCMS)

route.get("/admin/showtourscms", controller.authadmin,controller.showtourCMS);
route.get("/admin/edittourscms/:id", controller.authadmin,controller.edittourCMS);

route.post('/admin/editupdatetourscms',upload.single('image'),controller.editupdatetourCMS)



module.exports = route