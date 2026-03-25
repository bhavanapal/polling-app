import mongoose from "mongoose";

export const createConnection = async()=>{
    try{
// get mongodb URI from env
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('MONGODB URI is', MONGODB_URI);

    if(!MONGODB_URI){
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const options = {
        connectTimeoutMS: 10000, 

        maxPoolSize:10, 

       useNewUrlParser: true, 

      useUnifiedTopology: true, 

      autoIndex: process.env.NODE_ENV !== 'production', 
  };
    
    // Connect to MongoDB
   return  await mongoose.connect(MONGODB_URI, options);
    } catch(err){
      throw err;
    }
}