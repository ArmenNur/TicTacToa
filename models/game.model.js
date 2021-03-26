const mongoose = require('mongoose')

const Game = new mongoose.Schema({
    userChoice:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        default: 'onProccess'
    },
    history:{
        type: String,
        default: ''
    }
    
})

mongoose.model("Game", Game)