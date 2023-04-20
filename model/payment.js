const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
       user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
        },
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        startingdate:{
            type:String,
            require:true
         },
        endingdate:{
            type:String,
            require:true
        },
        packagename:{
            type:String,
            require:true
        },
        personcount:{
            type:String,
            require:true
        },
        
},{timestamps:true})

const paymentModel = mongoose.model('Bookings',paymentSchema)

module.exports = paymentModel