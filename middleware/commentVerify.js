const User = require("../model/user");

exports.fakeVerify = (req, res, next) => {
    User.findOne({
        email: req.body.email,
        name: req.body.name
    }).then(data => {
        const name = req.body.name
        const email = req.body.email

        if (!(email && name)) {
            req.flash('message5','All Input Require')
            return res.redirect('/about')
        }
        if (data) {

            next()
        }
        else {
            req.flash('message6','Incorrect Credentials')
            return res.redirect('/about')
        }
       
    })
        .catch(err => {
            console.log(err);
            next();
        })
}