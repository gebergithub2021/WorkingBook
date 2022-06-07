const Joi =require('joi'); 

const Schema = Joi.object({
  email: Joi.string().email().required(),
  fullname:Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});

module.exports= Schema;