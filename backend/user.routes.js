import express from 'express';
import { User } from './user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        console.log("Received data:", req.body); 

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("User already exists:", existingUser); 
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: createdUser._id }, process.env.SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });

        const updatedUser = await User.findByIdAndUpdate(createdUser._id, { $set: { token } }, { new: true });

        console.log("User created:", createdUser);
        return res.status(201).json({ user: updatedUser });
    } catch (error) {
        console.error("Error creating user:", error.message); 
        return res.status(400).json({ message: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true });

        const updatedUser = await User.findByIdAndUpdate(existingUser._id, { $set: { token } }, { new: true });

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Error logging in:", error.message); 
        return res.status(400).json({ message: error.message });
    }
});

// logout route

router.get('/logout',async(req,res)=>{
    res.cookie('token',"")
})

export { router };
