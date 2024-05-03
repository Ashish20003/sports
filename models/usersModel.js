const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    contactNumber:{
        type:Number,
        required : true,
        unique:true,
    },
    wishlist: [String],
    cart: [String]
});

const User = mongoose.model('User', userSchema);
module.exports = User;