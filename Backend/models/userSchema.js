const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
    nombre:{ 
        type:String,
        require: true
    },
    apellidos:{
        type:String,
        require: true
    },
    dni:{
        type:String,
        require: true
    },
    correo:{
        type:String,
        require: true
    },
    celular:{
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
    contraseña:{
        type:String,
        require: true
    }
    
})

const User = mongoose.model('User', userSchema)

module.exports = User
