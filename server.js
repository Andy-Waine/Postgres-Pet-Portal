const express = require("express");
const http = require("http");
const server = http.createServer(app);
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const path = require('path');
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

//CSS Rendering
app.use('/public', express.static('public'));

//Image Rendering
app.use('/images', express.static(path.join(__dirname, 'images')))

//Express
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

//Encrypts stored database info
app.use(
  session({
    secret: "secret",
    //re-save variables if nothing has changed? false.
    resave: false,
    // Save variables if fields are blank? false.
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//req, res gets
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  console.log(req.session.flash.error);
  res.render("login.ejs");
});

//bingo bango
app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { 
    user: req.user.name, 
    serialno: req.user.serialno,
    nameofpet: req.user.nameofpet,
    sexofpet: req.user.sexofpet,
    speciesofpet: req.user.speciesofpet,
    breedofpet: req.user.breedofpet,
    colorofpet: req.user.colorofpet
  });
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "Logged Out" });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2, serialno, nameofpet, sexofpet, speciesofpet, breedofpet, colorofpet } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2,
    serialno,
    nameofpet,
    sexofpet,
    speciesofpet,
    breedofpet,
    colorofpet
  });

  if (!name || !email || !password || !password2 || !serialno || !nameofpet || !sexofpet || !speciesofpet || !breedofpet || !colorofpet) {
    errors.push({ message: "All Fields Required" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password Minimum Length: 6 Characters" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords Do Not Match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2, serialno, nameofpet, sexofpet, speciesofpet, breedofpet, colorofpet });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Account Already Exists - Please Login or Use a New E-mail"
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password, serialno, nameofpet, sexofpet, speciesofpet, breedofpet, colorofpet)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, password`,
            [name, email, hashedPassword, serialno, nameofpet, sexofpet, speciesofpet, breedofpet, colorofpet],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "Registered - Please Login");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}


server.listen(process.env.PORT);

app.listen(PORT, () => {
  console.log(`This Server is Running on Port ${PORT}`);
});