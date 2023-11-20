const express = require("express");
const { loginUser, createUser, checkAuth, signOut } = require("../controller/Auth");
const router = express.Router();
const passport = require('passport');

router.post("/signup" ,createUser)
.post("/login", passport.authenticate('local'), loginUser)
.get('/check',passport.authenticate('_jwt'), checkAuth)
.get('/signout', signOut)

exports.router = router;


