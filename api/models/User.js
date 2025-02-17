import mongoose from 'mongoose';
import bcypt from 'bcryptjs';

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
    enum: ['under 18', '18', 'over 18'],
  },
  gender:{
    type: String,
    required: true,
      enum:['male' , 'female', 'other']
    },
  image: {
    type: String, 
    required: true 
    },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],  
},
  ); 


userSchema.pre('save', async function (next) {

  this.password = await bcypt.hash(this.password, 10);
  next();
})  // 1234-> hashed password


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcypt.compare(enteredPassword, this.password);
};  // this is a method that will be available on the user copmared to statics


const User = mongoose.model('User', userSchema);

export default User;