import User from "../../../models/user.js";
import {generateToken} from "../middlewares/auth-middleware.js";

// Register/signup New user
export const registerUser = async(req, res) => {
    try{
      const {name, email, password} = req.body;

      if(!name || !email || !password)
      return res.status(400).json({message:"All fields are required"});

      const existUser = await User.findOne({email});
      if(existUser)
      return res.status(400).json({message:"User already exists"});
       
      const user = await User.create({name,email,password});

      const token = generateToken(user);
      console.log("Generated Token:", token); 

      res.status(201).json({
        user:{
            id: user._id,
            name: user.name,
            email:user.email,
            role:user.role,
        },
        token,
      
      });
 } catch(err){
      res.status(500).json({message:"Server error", error:err.message}) ;
    }
};

// Login User & get token
export const loginUser = async(req,res) => {
    try{
        // extract email & password from request body
       const {email, password} = req.body;

       if(!email || !password){
        return res.status(400).json({message:"All fields required"});
       }

       const user = await User.findOne({email});
       if(!user){
       return res.status(400).json({message:"User does not exist"});
       }

       const isMatch = await user.matchPassword(password);
       if(!isMatch){
       return res.status(400).json({message:"Invalid credentials"});
       }

       const token = generateToken(user);

       res.status(200).json({
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        },
        token,
       });
    } catch(err){
      res.status(500).json({message: "Login failed", error:err.message});
    }
};

// Access User Profile(token required)
export const userProfile = async(req, res) =>{
    try{
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
       res.status(200).json({user});
    } catch(err){
      res.status(500).json({message:"Internal server error"});
    }
};

// update-password(token & currentpassword required)
export const updatePassword = async(req,res) => {
    try{
     const userId = req.user._id;
     const {currentPassword, newPassword} = req.body;

     if(!currentPassword || !newPassword){
      return res.status(400).json({message:"All fields required"});
     }

     const user = await User.findById(userId);

     const isMatch = await user.matchPassword(currentPassword);
     if(!isMatch){
     return res.status(400).json({message:'Current Password is incorrect'});
     }

    if(currentPassword === newPassword){
      return res.status(400).json({message:"New password must be different"});
    }

    //update the user's password
     user.password = newPassword
     await user.save();

     res.status(200).json({message:'Password Updated Successfully'});
    } catch(err){
      res.status(500).json({message:'Server error'});
    }
};