const mongoose = require('mongoose');
const bcryp=require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema=new Schema(
    {
        email:{
            type:String,
            required:true,
            unique: true,
		    lowercase: true,
        },
        fullname:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            toJson:false,
        },
        role:{
            type:String,
            default:'user',
            enum:['user','admin']
        }
    }
);

UserSchema.pre("save",async function(next){

    try {
        if (this.isNew) {
            const salt = await bcryp.genSalt(10);
            const hashed = await bcryp.hash(this.password,salt);
            this.password=hashed;
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPass=async function(pass){
    return await bcryp.compare(pass,this.password);
};

const User = mongoose.model('User',UserSchema);
module.exports=User;