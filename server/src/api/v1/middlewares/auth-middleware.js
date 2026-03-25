import jwt from 'jsonwebtoken';
import User from '../../../models/user.js';

 const protect = async(req,res,next) => {
    try{
       const authHeader = req.headers.authorization;
       console.log("Received Auth Header:", authHeader);

       if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"No token provided"});
       }

       const token = authHeader.split(" ")[1];
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

       const user = await User.findById(decoded.id).select("-password");
       if(!user) return res.status(401).json({message:"User not found"});

      // Attached user information to the request object
       req.user = user;
       console.log("Attached user to req:", user._id);
       next();
    } catch(err){
      console.log("Auth Error:", err.message);
      res.status(401).json({message: "Unauthorized", error: err.message});
    }
};

// optional admin middleware
export const adminOnly = (req, res,next) => {
  if(req.user.role !== "admin"){
    return res.status(403).json({message:"Admin access only"});
  }
  next();
};

export default protect;

export const generateToken = (user) => 
jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET,{
    expiresIn : "7d",
});

