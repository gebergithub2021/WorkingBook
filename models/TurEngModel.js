const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkingSchema=new Schema({
    TurkishWord:{
        type:String,
    },
    EnglishWord:{
        type:String,
    },
    Description:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean,
        default:true
    }

});
const TurEng = mongoose.model('TurEngModel',WorkingSchema);
module.exports= TurEng;