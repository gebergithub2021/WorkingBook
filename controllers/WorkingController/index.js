const Working = require('../../models/TurEngModel');
const Boom =require('boom');
const validation=require('./validations');

const AddWord = async (req,res,next)=>{
    const inputData = req.body;
    console.log(inputData);
    const {validationError} = validation.validate(inputData);
    if (validationError) {
		return next(Boom.badRequest(validationError.details[0].message));
	};

    try{
        const working = new Working(inputData);
        const savedData = await working.save();
        res.json(savedData);
    }catch(e){
        next(e);
    }
};

const Get=async(req,res,next)=>{
    const {word_id} = req.body;
    if(!word_id){
        return next(Boom.badRequest("Missing parameter (:word_id)"));
    }

    try {
		const word = await Working.findById(word_id);
		res.json(word);
	} catch (e) {
		next(e);
	}
};
const Update = async(req,res,next)=>{
    const {word_id}=req.body;
    if(!word_id){
        return next(Boom.badRequest("Missing parameter (:word_id)"));
    }

    try{
        const updateData= await Working.findByIdAndUpdate(word_id,req.body,{new:true});
        res.json(updateData);
    }catch(e){
        next(e);
    };
};

const Delete = async(req,res,next)=>{
    const {word_id} = req.body;

    if(!word_id){
        return next(Boom.badRequest("Missing parameter (:word_id)"));
    };

    try{
        const deletedData =await Working.findByIdAndDelete(word_id);
        if (!deletedData) {
			throw Boom.badRequest("An error occurred while deleting...");
		};

        res.json(deletedData);
    }catch(e){
        next(e);
    };
};

const GetAll=async(req,res,next)=>{
    try{
        const words = await Working.find({}).sort({ createdAt: -1 });
        res.json(words);
    }catch(e){
        next(e);
    };
}
module.exports= {
	AddWord,
	Get,
	Update,
	Delete,
    GetAll
}
