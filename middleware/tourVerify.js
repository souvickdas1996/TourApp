const User = require("../model/user");

exports.duplicateVerify = (req, res, next) => {
    User.findOne({
        email: req.body.email,
        name: req.body.name
    }).then(data => {
        const name = req.body.name
        const email = req.body.email

        if (!(email && name)) {
            req.flash('message5','All Input Require')
            return res.redirect('/payment')
        }
        if (data) {

            next()
        }
        else {
            req.flash('message6','Incorrect Credentials')
            return res.redirect('/payment')
        }
       
    })
        .catch(err => {
            console.log(err);
            next();
        })
}