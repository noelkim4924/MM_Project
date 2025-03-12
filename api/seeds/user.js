import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];

const femaleNames = [
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Elizabeth",
  "Barbara",
  "Susan",
  "Jessica",
  "Sarah",
  "Karen",
  "Nancy",
  "Lisa",
];


const otherNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Casey",
  "Morgan",
  "Riley",
  "Avery",
  "Skyler",
  "Quinn",
  "Peyton",
];

const bioDescriptors = [
  "Coffee addict",
  "Cat lover",
  "Dog person",
  "Foodie",
  "Gym rat",
  "Bookworm",
  "Movie buff",
  "Music lover",
  "Travel junkie",
  "Beach bum",
  "City slicker",
  "Outdoor enthusiast",
  "Netflix binger",
  "Yoga enthusiast",
  "Craft beer connoisseur",
  "Sushi fanatic",
  "Adventure seeker",
  "Night owl",
  "Early bird",
  "Aspiring chef",
];

const generateBio = () => {
  const descriptors = bioDescriptors.sort(() => 0.5 - Math.random()).slice(0, 3);
  return descriptors.join(" | ");
};

const generateRandomUser = (gender, index) => {
  let names;
  if (gender === "male") {
    names = maleNames;
  } else if (gender === "female") {
    names = femaleNames;
  } else {
    names = otherNames;
  }

  const name = names[index];
  // age를 enum 값 중 무작위로 선택
  const ageOptions = ['under 18', '18', 'over 18'];
  const age = ageOptions[Math.floor(Math.random() * ageOptions.length)];
  return {
    name,
    email: `${name.toLowerCase()}${age.toLowerCase().replace(/\s/g, '')}@example.com`, // email에 age 포함, 공백 제거
    password: bcrypt.hashSync("password123", 10),
    age,
    gender,
    image: "",
  };
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
    const femaleUsers = femaleNames.map((_, i) => generateRandomUser("female", i));
    const otherUsers = otherNames.map((_, i) => generateRandomUser("other", i));

    const allUsers = [...maleUsers, ...femaleUsers, ...otherUsers];

    await User.insertMany(allUsers);

    console.log("Database seeded successfully with users");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();