const AccessControl = require('accesscontrol');
const ac=new AccessControl();

const roles =()=>{
    ac.grant('user').readAny('TurEngModel').createAny('TurEngModel');
    ac.grant('admin').extend('user').readAny('user').createAny('user');
};

module.exports=roles;