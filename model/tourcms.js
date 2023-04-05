const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    placename:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    startingdate:{
        type:String,
        require:true
    },
    duration:{
        type:String,
        require:true
    },
    Price:{
        type:String,
        require:true
    },
    personcount:{
        type:String,
        require:true
    },
})

const tourModel = mongoose.model('tourcms',tourSchema)
module.exports = tourModel