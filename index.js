const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./routes/Product");
const filtersRouter = require("./routes/Filters");
const cartRouter = require("./routes/Cart");
const OrdersRouter = require("./routes/Orders");
const UserRouter = require("./routes/User");
const AuthRouter = require("./routes/Auth");
const server = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("./model/User");
const { isAuth, sanitizeUser, cookiesExtracter } = require("./controller/Middlewere");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
main().catch((err) => console.error(err));

server.use(express.json());
server.use(express.static(path.resolve(__dirname, 'build')))
server.use(express.static("public"));


async function main() {
  await mongoose.connect(process.env.mongo_URL);
  console.log("MongoDB connected");
}
server.use(cookieParser());
server.use(cors());



server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(
  session({
    secret:process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  })
);
server.use(passport.initialize());
// set session for only 1 hour :todo
server.use(passport.session());
server.use(passport.authenticate("session"));
passport.use(
  "local",
  new LocalStrategy({usernameField: "email"}, async function (email, password, done) {
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { msg: "User does Not exit" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { msg: "password is wrong" });
      }
      jwt.sign(sanitizeUser(user),process.env.JWT_SECRET_KEY,{ expiresIn: "1h" },(err, token) => {
          if (err) throw err;
          return done(null, token );
        }
      );
    } catch (err) {
      console.error(err.message);
      done(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, sanitizeUser(user));
  });
});
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

let opts = {};
opts.jwtFromRequest = cookiesExtracter;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(
  "_jwt",
  new JwtStrategy(opts,async function (jwt_payload, done) {
    try {
      const user = await User.findById({ _id: jwt_payload.id });
      if (user) {
        return done(null,sanitizeUser(user));
      }else{
        return done(null, false, { msg: "User does Not exit" });
      }
    } catch (err) {
      console.error(err.message);
      done(err);
    }
  })
);

// paymentIntent
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


server.use("/products", productsRouter.router);
server.use("/filters", filtersRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders",isAuth(), OrdersRouter.router);
server.use("/user",isAuth(), UserRouter.router);
server.use("/auth", AuthRouter.router);

server.get('/', (req, res) =>
  res.json({"success": true})
);
server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);

server.listen(3000, () => {
  console.log("server started");
});
