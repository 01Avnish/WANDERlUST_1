if(process.env.NODE_ENV != "production")
{
    require('dotenv').config(); 
} 


const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
// app.use(express.static("public"));



const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log("this is the error", err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
       secret: process.env.SECRET,
    },
    touchAfter: 3600 * 24,
});
store.on("error",()=>{
    console.log("ERROOR IN MONGO SESSION STORE",error);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    caches:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // used to prevent attacks ( Cross-Site Scripting (XSS) Attacks)
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});















const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { request } = require("http");
const { error } = require('console');


app.get("/", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});






// const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";












// for listings
app.use("/listings",listingRouter);
// for reviews
app.use("/listings/:id/reviews",reviewRouter);
// for user
app.use("/",userRouter);


app.use((err, req, res, next) => {
    let{statusCode = 500,message = "this is the error"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
});



app.listen(3000, () => {
    console.log("server is listening on port 3000");
});








