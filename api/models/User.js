import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
    enum: ['under 18', '18', 'over 18', '18+'],
  },
  gender:{
    type: String,
    required: true,
      enum:['male' ,'female','other']
    },
  role: {
    type: String,
    required: true,
    enum: ['mentor', 'mentee', 'admin'],
    },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    availability: { type: [String], default: [] },
    categories: [
      {
        categoryId: { type: String, required: true }, 
        status: { type: String, enum: ["pending", "verified", "declined"], default: "pending" }
      }
    ],
    
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],  
},
  ); 


  userSchema.pre("save", async function (next) {
   
    if (!this.isModified("password")) {
      return next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  const User = mongoose.model("User", userSchema);
  
  export default User;