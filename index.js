const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require("./models/usersModel");
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Middleware
const { log } = require('console');
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
const {restrictToLoggedInUserOnly}=require("./middlewares/authMiddleware");

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


// Routes
const userRouter = require('./routes/userRoute');
app.use('/',userRouter);

const cartRouter = require('./routes/cartRoute');
app.use('/',restrictToLoggedInUserOnly,cartRouter);



app.get('/index',restrictToLoggedInUserOnly,(req,res)=>{
    res.render("index");
})

app.get("/products/badminton-products", restrictToLoggedInUserOnly, (req, res) => {
    res.render("badminton_products", { userId: req.user.id }); // Assuming you have a user object with an id property
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
