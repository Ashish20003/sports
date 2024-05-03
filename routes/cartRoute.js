const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {getUser,setUser} = require("../service/auth")
const User = require('../models/usersModel')

router.post("/add-to-cart", async (req, res) => {
    const sessionId = req.cookies.uid; // Extract session ID from cookie
    const itemId = req.body.itemId; // Extract item ID from request body
    
    // Retrieve user ID using session ID
    const user = getUser(sessionId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        // Update the user's document to add the item to their cart
        const updatedUser = await User.findByIdAndUpdate(user._id, { $push: { cart: itemId } }, { new: true });
        
        if (updatedUser) {
            res.status(200).json({ message: "Item added to cart successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(400).json({ message: "Failed to add item to cart" });
    }
});


router.post("/add-to-wishlist", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wishlist.includes(itemID)) {
            return res.status(400).json({ message: "Item is already present in wishlist" });
        }

        user.wishlist.push(itemID);
        await user.save();

        res.status(200).json({ message: "Item added to wishlist successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove item from cart
router.post("/remove-from-cart", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userID, { $pull: { cart: itemID } }, { new: true });
        if (user) {
            res.status(200).json({ message: "Item removed from cart successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to remove item from cart" });
    }
});

// Remove item from wishlist
router.post("/remove-from-wishlist", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userID, { $pull: { wishlist: itemID } }, { new: true });
        if (user) {
            res.status(200).json({ message: "Item removed from wishlist successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to remove item from wishlist" });
    }
});


module.exports = router;
