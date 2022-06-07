const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//bu model de güncellenecek, userId olarak foreign key gelmesi lazım.

const WorkingSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
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