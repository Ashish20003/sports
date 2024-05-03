const express = require("express");
const router = express.Router();
const User = require('../models/usersModel');
const {v4:uuidv4} = require('uuid');
const {setUser,getUser,destroyUser} = require('../service/auth');

router.get("/",(req,res)=>{
    res.redirect("login")
})
router.get("/login",(req,res)=>{
    res.render("login")
})
router.get("/signup",(req,res)=>{
    res.render("signup")
})
router.post("/signup", async (req, res) => {
    try {
        // Check if the password meets the minimum length requirement
        if (req.body.password.length < 6) {
            return res.send('<script>alert("Password length should be at least 6 characters"); window.location.href="/signup";</script>');
        }
        if(req.body.contactNumber.length!=10){
            return res.send('<script>alert("Invalid Contact Number"); window.location.href="/signup";</script>')
        }
        // Check if the email already exists
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.send('<script>alert("Email already exists"); window.location.href="/signup";</script>');
        }

        // Check if the contact number already exists
        const existingContactNumber = await User.findOne({ contactNumber: req.body.contactNumber });
        if (existingContactNumber) {
            return res.send('<script>alert("Contact number already exists"); window.location.href="/signup";</script>');
        }
        if(req.body.password != req.body.cpassword){
            return res.send('<script>alert("Password and Confirm Password should be same !!"); window.location.href="/signup";</script>')
        }

        // Create a new user
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            wishlist: [],
            cart: []
        });

        // Save the user to the database
        await newUser.save();

        // Send success message and redirect
        res.send('<script>alert("User registered successfully"); window.location.href="/";</script>');
    } catch (error) {
        // Handle other errors
        console.error(error);
        res.send('<script>alert("Failed to register user"); window.location.href="/signup";</script>');
    }
});




router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingEmail = await User.findOne({email});
        if(!existingEmail) {
            return res.send('<script>alert("Email does not exist !!"); window.location.href="/login";</script>')
        }
        const user = await User.findOne({ email, password });
        if (user) {
            const sessionId = uuidv4();
            setUser(sessionId, user);
            res.cookie("uid", sessionId);
            res.redirect("/index");
        } else {
            res.send('<script>alert("Invalid password"); window.location.href="/login";</script>');
        }
    } catch (error) {
        console.error(error);
        res.send('<script>alert("Login failed"); window.location.href="/login";</script>');
    }
});


router.get('/logout', (req, res) => {
    const sessionId = req.cookies.uid; 
    destroyUser(sessionId);
    res.clearCookie("uid");
    res.redirect('/login');
});



router.get("/user/:userID", async (req, res) => {
    const userID = req.params.userID;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/update-profile", async (req, res) => {
    const { userID, username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userID, { username, email }, { new: true });
        if (updatedUser) {
            res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports =router;