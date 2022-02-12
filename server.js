const express = require("express");
const app = express();
const { pool } = require("./dbConfig");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false}));


app.get("/", (req, res) => {
    res.render('index');
});

app.get('/users/register', (req, res) => {
    res.render("register");
});

app.get('/users/login', (req, res) => {
    res.render("login");
});

app.get('/users/dashboard', (req, res) => {
    res.render("dashboard", { user: "andy" });
});

app.post('/users/register', (req, res) => {
    let { name, email, password, password2 } = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if  (!name || !email || !password || !password2) {
        errors.push({ message: "All Fields Required" });
    }

    if(password.length < 6) {
        errors.push({ message: "Password Minimum: 6 Characters" });
    }

    if(password != password2) {
        errors.push({ message: "Passwords Do Not Match" });
    }

    if(errors.length > 0) {
        res.render('register', { errors });
    }
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

