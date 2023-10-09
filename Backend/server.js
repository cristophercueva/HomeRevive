const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./models/userSchema')

//connect to express app
const app = express()
//connect to MongoDB
const dbURI = 'mongodb+srv://cristophercuevadeveloper:fOkWlBUFPSR81daq@homerevive.tplmdxb.mongodb.net/HomeRevive?retryWrites=true&w=majority'
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{
    app.listen(3001, () => {
        console.log('Server is connected to port 3001 and connected to MongoDb')
    })

})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDb');
})
//middleware
//schema
//routes
