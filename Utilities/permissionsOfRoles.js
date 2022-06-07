const {roles}=require('./role');
const Boom = require('boom');

const accessing=(action,resource)=>{

    return async(req,res,next)=>{
        const permissions=roles.can(req.payload.role)[action](resource);
        if(!permissions.granted){
            return next(Boom.unauthorized("You don't have permission."));
        }
        next();
    }
    
};

module.exports=accessing;