const Boom = require('boom');
const redis = require('../Utilities/redis');
const JWT = require('jsonwebtoken');

const signAccessToken = (data)=>{
    return Promise((resolve, reject)=>{
        const payload={...data};
        const options={
            expiresIn:"15d",
            issuer:"WorkingBook"
        };

        JWT.sign(payload,process.env.JWT_SECRET_CODE,options,(err,token)=>{
            if(err) {
                console.log(err);
                reject(Boom.internal());
            }
            resolve(token);
        })
    });
};
const signRefreshToken = (user_id)=>{
    return Promise((resolve,reject)=>{
        const payload = {
            user_id,
        };
        const options = {
			expiresIn: "180d",
			issuer: "WorkingBook",
		};

        JWT.sign(payload,process.env.JWT_REFRESH_SECRET,(err,token)=>{
            if(err){
                console.log(err);
                reject(Boom.unauthorized());
            }

            redis.set(user_id, token, "EX", 180 * 24 * 60 * 60);
            resolve(token);
        });

    })
};
const verifyAccessToken=(req,res,next)=>{
    const authorizationToken = req.headers["authorization"];
    if(!authorizationToken){
        next(Boom.unauthorized());
    }

    JWT.verify(authorizationToken,process.env.JWT_SECRET_CODE,(err,payload)=>{
        if(!authorizationToken){
            return next(Boom.unauthorized(
                err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
            ));
        }

        req.payload=payload;
        next();
    })
};
const verifyRefreshToken=(refresh_token)=>{
    JWT.verify(refresh_token,
        process.env.JWT_REFRESH_SECRET,
        async (err,payload)=>{
            if(err){
                return reject(Boom.unauthorized());
            }

            const {user_id}=payload;
            const user_token = redis.get(user_id);
            if (!user_token) {
                return reject(Boom.unauthorized());
            }

            if (refresh_token === user_token) {
                return resolve(user_id);
            }
        }
        );
};

exports.module={
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}