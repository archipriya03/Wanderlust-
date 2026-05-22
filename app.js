if(process.env.NODE_ENV != "production")
  {require("dotenv").config(); }  
console.log(process.env.CLOUD_API_SECRET);

const { MongoStore } = require("connect-mongo");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsyncs = require("./utils/wrapAsyncs.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");
const Review= require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const listings=require("./routes/listing.js"); //routes related to listing
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoutes = require("./routes/user.js"); //routes 
const reviewRoutes = require("./routes/reviews.js"); //routes related to reviews


const dbUrl = process.env.ATLASDB_URL;

// MongoDB connection
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Database connection error:");
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// View engine setup
app.engine("ejs", ejsMate); // use ejs-mate for layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", ()=>{
  console.log("Session store error");
});


const sessionOptions = {
 store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,  
  cookie : {
expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
   maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,

  }
};
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //storing the info related to user in the session
passport.deserializeUser(User.deserializeUser()); //removing the info related to user from the session when the user logs out








app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make the current user available in all templates
  next();
});


app.get("/", (req, res) => {
    res.redirect(301, "/listings");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);



// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
