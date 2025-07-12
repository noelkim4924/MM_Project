import User from '../models/User.js';
import Log from '../models/Log.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Token from '../models/Token.js';
import crypto from 'crypto';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {

  const { name, email, password,age,gender,role } = req.body;

  if(age !== "19+"){
    return res.status(400).json({
      sucess: false,
      message: 'You must be at least 19 years old'})
  }
  
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

    

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
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

    // Log the user creation
    await Log.create({
      user: newUser._id,
      action: `USER created`,
      timestamp: Date.now()
    });

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
      httpOnly : true, 
      sameSite :"strict", 
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

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('+password');

    if (!user || !(await user.matchPassword(oldPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};

const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await Token.create({
      token: hashedToken,
      userId: user._id,
      expireAt,
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.status(200).json({
      success: true,
      message: 'Email sent',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const tokenDoc = await Token.findOne({
      token: hashedToken,
      expireAt: { $gt: Date.now() },
    });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = req.body.password;
    await user.save();

    await Token.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};