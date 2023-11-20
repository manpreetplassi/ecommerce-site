const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require("../model/User");
const { sanitizeUser } = require('./Middlewere');

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: { msg: 'User already exists' } });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });

        await user.save();
        req.login(sanitizeUser(user), err =>{
            if(err){
                res.status(400).json(err);
            }else{
        const token = jwt.sign(sanitizeUser(user),process.env.JWT_SECRET_KEY,{ expiresIn: "1h" });
        res.cookie('_jwt', token , { expires: new Date(Date.now() + 3600000), httpOnly: true });
                res.json(sanitizeUser(user));
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    try {
            res.cookie('_jwt', req.user, { expires: new Date(Date.now() + 3600000), httpOnly: true });
            res.status(200).json(req.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.checkAuth = async (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.sendStatus(401);
    }
  };
  
  exports.signOut = async (req, res) => {
    res
      .cookie('_jwt', '', {
        expires: new Date(0),
        httpOnly: true,
        path: '/', // Set the path of the cookie
      })
      .sendStatus(200)
    //   .json({status: "success"})
  };
  
