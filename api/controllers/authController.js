import User from '../models/User.js';

import jwt from 'jsonwebtoken';

const signToken = (id) => {
  //jwt token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  
}

export const signup = async (req, res) => {

  const { name, email, password,age,gender,role } = req.body;
  try {
    if(!name || !email || !password || !age|| !gender|| !role){
      return res.status(400).json({
        sucess: false,
        message: 'Please fill in all fields'})
    }

    if(password.length < 6){
      return res.status(400).json({
        sucess: false,
        message: 'Password must be at least 6 characters'})
    }

    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      role,

    })


    const token = signToken(newUser._id);


    res.cookie("jwt",token, {
      maxAge : 7 * 24 * 60 * 60 * 1000,   // 7 days
      httpOnly : true, // cookie cannot be accessed by the browser
      sameSite :"strict", // cookie cannot be accessed by the browser
      secure : process.env.NODE_ENV === "production",
    })

    res.status(201).json({
      sucess: true,
      // token, no need token in response because we are setting it in cookie
      user: newUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: 'Server Error'
    })
  }
}  
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {

    if(!email || !password){
      return res.status(400).json({
        sucess: false,
        message: 'Please fill in all fields'})
    }

    const user = await User.findOne({ email }).select('+password'); 

    if(!user || !(await user.matchPassword(password))){
      return res.status(401).json({
        sucess: false,
        message: 'Invalid Email or Password'})
    }

    const token = signToken(user._id);

    res.cookie("jwt",token, {
      maxAge : 7 * 24 * 60 * 60 * 1000,   // 7 days
      httpOnly : true, // cookie cannot be accessed by the browser
      sameSite :"strict", // cookie cannot be accessed by the browser
      secure : process.env.NODE_ENV === "production",
    })

    res.status(200).json({
      sucess: true,
      user: user
    })

  } catch (error) {
    console.log("error in login controller : ", error);
    res.status(500).json({
      sucess: false,
      message: 'Server Error'
    })
  }
}
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    sucess: true,
    message: 'Logged out'
  })
}