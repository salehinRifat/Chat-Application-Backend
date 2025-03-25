import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        if (newUser) {
           generateToken(newUser._id,res);
           await newUser.save();
             res.status(201).json({ 
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
              });
         
        } else {
             res.status(400).json({ message: "Invalid User data" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const login = (req, res) => {

};
export const logout = (req, res) => {

};