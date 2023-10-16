const mongoose = require('mongoose')

const personalSchema = new mongoose.Schema(
    {
    name:{ 
        type:String,
        require: true
    },
    surname:{
        type:String,
        require: true
    },
    dni:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true
    },
    phone:{
        type:String,
        require: true
    },
    cargo:{
        type:String,
        require: true
    },
    username:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
    
})

const personal = mongoose.model('personal', personalSchema)

module.exports = personal
