const mongoose = require('mongoose')

const option = require('./keys')

mongoose
    .connect(`${option.dbUrl}/${option.db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log(err)
            throw ('mongo connect faild', err.errmsg)
        } else {
            console.log('db connected')
        }

    })
   
module.exports = mongoose;