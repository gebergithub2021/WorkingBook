const Joi = require('joi');

const WorkingSchema = Joi.object(
    {
        TurkishWord:Joi.string().required(),
        EnglishWord:Joi.string().required(),
        Description:Joi.string(),
        createdAt:Joi.date(),
        isActive:Joi.boolean()
    }
);
module.exports=WorkingSchema;