const Adminmodel = require('../model/admin')

exports.duplicateVerify=(req,res,next)=>{
    Adminmodel.findOne({email:req.body.email}).then((email,err)=>{
        if (err) {
         console.log(err);
         return err   
        }
    
        if (email) {
            req.flash('message','email already exist')
            return res.redirect('/admin/create')
        }
    
        const password = req.body.password
        const confirm = req.body.cpassword
        const name = req.body.name
        
        if (password!==confirm) {
            req.flash('message','password doesnot match')
            return res.redirect('/admin/create')
        }
    
        if (!(password && confirm && name)) {
            req.flash('message','all input require')
            return res.redirect('/admin/create')
        }

        next()
    })
}
