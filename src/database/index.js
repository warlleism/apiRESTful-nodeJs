const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest').then(() => {
    console.log("MongoDB COnectado")
}).catch((err) => {
    console.log('Erro ao se conectar ao mongoDB: ' + err)
})
mongoose.Promise = global.Promise;

module.exports = mongoose;
