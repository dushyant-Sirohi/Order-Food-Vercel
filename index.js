require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const webRoutes = require("./routes/web");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const PORT = process.env.PORT || 3000;
// const DATABASE_URI = process.env.DATABASE_URI || "mongodb://localhost:27017";
const DATABASE_URI = "mongodb+srv://dushyantsirohi217:1535452@cluster0.hb3o3gi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "mongodb://localhost:27017";

//Database
try {
    const options = {
        dbName: "food",
    };
    mongoose.connect(DATABASE_URI, options);
    console.log("Database Connected");
} catch (error) {
    console.log(error);
}

//Session
app.use(
    session({
        // secret: process.env.COOKIE_SECRET,
        secret: "CatsAndDogs",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 12 },
        store: MongoStore.create({ mongoUrl: DATABASE_URI }),
    })
);

// Passport auth
const passportInit = require("./app/config/passport");
app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);

app.use(flash());

app.use(expressLayout);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

webRoutes(app);
// app.get('/home', (req, res) => {
//   res.send("Hello World");
// });

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
