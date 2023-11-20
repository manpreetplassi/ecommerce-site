const jwt = require("jsonwebtoken");
const passport = require("passport");


exports.isAuth = (req, res, done) => {
    return passport.authenticate('_jwt');
}

exports.sanitizeUser = (user) => {
    return {id: user.id, role: user.role}
}
exports.cookiesExtracter = function(req){
    let token = null;
    if (req.cookies && req.cookies._jwt) {
        token = req.cookies._jwt;
    }
    
    // token = "";
    return token;
  
}