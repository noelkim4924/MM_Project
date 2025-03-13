import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../../', '.env') });

const maleNames = ['James', 'John']; 
const femaleNames = ['Mary', 'Patricia']; 
const otherNames = ['Alex']; 

const bioDescriptors = [
  'Coffee addict', 'Cat lover', 'Dog person', 'Foodie', 'Gym rat', 'Bookworm', 'Movie buff', 'Music lover',
  'Travel junkie', 'Beach bum', 'City slicker', 'Outdoor enthusiast', 'Netflix binger', 'Yoga enthusiast',
  'Craft beer connoisseur', 'Sushi fanatic', 'Adventure seeker', 'Night owl', 'Early bird', 'Aspiring chef',
];

const generateBio = () => {
  const descriptors = bioDescriptors.sort(() => 0.5 - Math.random()).slice(0, 3);
  return descriptors.join(' | ');
};

const generateRandomMentor = async (gender, index) => {
  let names;
  if (gender === 'male') names = maleNames;
  else if (gender === 'female') names = femaleNames;
  else names = otherNames;

  const name = names[index % names.length];
  const ageOptions = ['under 18', '18', 'over 18'];
  const age = ageOptions[Math.floor(Math.random() * ageOptions.length)];
  const email = `${name.toLowerCase()}${age.toLowerCase().replace(/\s/g, '')}${Math.floor(Math.random() * 1000)}@example.com`;

  const categoryDoc = await Category.findOne({});
  if (!categoryDoc) throw new Error('No categories found');
  const categories = categoryDoc.categories;

  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const subcategories = randomCategory.subcategories;

  const mentorCategories = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => subcategories[Math.floor(Math.random() * subcategories.length)]._id
  );

  return {
    name,
    email,
    password: bcrypt.hashSync('password123', 10),
    age,
    gender,
    role: 'mentor',
    image: '',
    bio: generateBio(),
    availability: ['Monday', 'Wednesday', 'Friday'],
    categories: mentorCategories,
    matches: [],
  };
};

const seedMentors = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding mentors');


    await User.deleteMany({});


    const maleMentors = await Promise.all(
      maleNames.map((_, i) => generateRandomMentor('male', i))
    );
    const femaleMentors = await Promise.all(
      femaleNames.map((_, i) => generateRandomMentor('female', i))
    );
    const otherMentors = await Promise.all(
      otherNames.map((_, i) => generateRandomMentor('other', i))
    );

    const allMentors = [...maleMentors, ...femaleMentors, ...otherMentors];

    await User.insertMany(allMentors);
    console.log('Database seeded successfully with 5 mentors');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedMentors();