const Boom = require('boom');
const User = require('../../models/User');
const {signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken } = require('../../Helper/JWTHelper');

const validationSchema = require('./validation');
const redis = require('../../Utilities/redis');
//Register---
const Register = async (req,res,next)=>{
    const inputData=req.body;
    const {validationError}=validationSchema.validate(inputData);

    if (validationError) {
        return next(Boom.badRequest(validationError.details[0].message));
    }

    try {
        const isExist = await User.findOne({email:inputData.email});
        if (isExist) {
            return next(Boom.conflict('This email is already using.'));
        }
        const user = new User(inputData);
        const userData = await user.save();
        const objUserData=userData.toObject();
        
        delete objUserData.password;
        delete objUserData.__v;

        const accessToken =await signAccessToken({
            user_id:user._id,
            role:user.role
        });

        const refreshToken = await signRefreshToken(user_id);
        res.json(
            {
                user:objUserData,
                accessToken,
                refreshToken
            }
        );

    } catch (e) {
        return next(e);
    }
};

const Login = async(req,res,next)=>{
    const inputData = req.body;
    //Hataları yönetelim.
    //Hata yönetimi başladı.
    const {validationError} = validationSchema.validate(inputData);
    if (validationError) {
        return next(Boom.badRequest(validationError.details[0].message));
    }

    try {
        const user = await User.findOne({email:inputData.email});

        if (!user) {
            return Boom.notFound('The email address was not found.');
        }

        const isMatched=await user.isValidPass(inputData.password);
        if (!isMatched) {
            throw Boom.unauthorized('email or password was not matched.');
        }
        //Hata yönetimi bitti.
        //Giriş için gerekli bilgiler alınıyor.
        const accessToken = await signAccessToken({
            user_id:user._id,
            role:user.role
        });

        const refreshToken=await signRefreshToken(user_id);
        const userData=user.toObject();
        delete userData.password;
        delete userData.__v;
        res.json({user:userData, accessToken,refreshToken});

    } catch (error) {
        next(error);
    }
};

const Logout=async(req,res,next)=>{
    try {
    const {refresh_Token}=req.body;
    if (!refresh_Token) {
        throw Boom.badRequest();
    }

    const user_id=await verifyRefreshToken(refresh_Token);
    const userData=await redis.del(user_id);
    if (!userData) {
        throw Boom.badRequest();
    }
    res.json({message:'success'});
    } catch (error) {
        next(error);
    }
        
};

const RefreshToken = async(req,res,next)=>{
const {refresh_Token}=req.body;
try {
    if (!refresh_Token) {
        throw Boom.badRequest();
    }
    const user_id=await verifyRefreshToken(refresh_Token);
    const accessToken=await signAccessToken(user_id);
    const refreshToken = await signRefreshToken(user_id);
    res.json({accessToken,refreshToken});
} catch (error) {
    next(error);
}

};

const MyInfo=async(req,res,next)=>{
const {user_id}=req.payload;
try {
    const userData=await User.findById(user_id).select('-password -__v');
    res.json({userData});
} catch (error) {
    next(error);
}
};

exports.module={
    Register,
    Login,
    Logout,
    RefreshToken,
    MyInfo
};