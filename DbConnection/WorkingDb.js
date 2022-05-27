const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/WorkingBook')
.then(()=>console.log('MongoDb is connected...'))
.catch((e)=>console.log('Mongodb is not connected... '+e));