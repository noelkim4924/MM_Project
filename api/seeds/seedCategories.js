import mongoose from 'mongoose';
import Category from '../models/Category.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 경로 설정 (project_root 기준)
dotenv.config({ path: path.resolve(__dirname, '../../', '.env') });

const seedCategories = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // 디버깅용
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding categories');

    // 기존 데이터 삭제
    await Category.deleteMany({});

    // 카테고리 데이터
    const categories = [
      {
        name: 'Mentee: Career Growth & Navigation',
        subcategories: [
          { name: 'Interview in tech (first job)' },
          { name: 'Interview Preparation & Job Search' },
          { name: 'Transitioning to a new career in tech' },
          { name: 'Leadership & management skills' },
          { name: 'Technical Skills & Specializations' },
        ],
      },
      {
        name: 'Mentee: Professional Development & Soft Skills',
        subcategories: [
          { name: 'Public speaking & technical presentations' },
          { name: 'Networking in the tech industry' },
          { name: 'Personal branding (LinkedIn, portfolio, etc.)' },
          { name: 'Effective communication for engineers' },
          { name: 'Problem-solving & critical thinking' },
          { name: 'Interview Preparation & Job Search' },
          { name: 'Resume & portfolio reviews' },
          { name: 'Coding interview prep (LeetCode, system design, etc.)' },
          { name: 'Behavioral interview coaching' },
          { name: 'Salary negotiation strategies' },
          { name: 'Entrepreneurship & Startups' },
        ],
      },
      {
        name: 'Mentee: Diversity, Inclusion & Workplace Challenges',
        subcategories: [
          { name: 'Breaking barriers in tech as a minority' },
          { name: 'Women in tech mentorship' },
        ],
      },
      {
        name: 'Mentor: Software Development & Engineering',
        subcategories: [
          { name: 'Front-end (React, Angular, Vue)' },
          { name: 'Back-end (Node.js, Python, Java, Go, etc.)' },
          { name: 'Mobile (iOS, Android, Flutter, React Native)' },
          { name: 'DevOps & Cloud Computing (AWS, Azure, Google Cloud)' },
          { name: 'Cybersecurity & Ethical Hacking' },
          { name: 'Database Management & Big Data' },
        ],
      },
      {
        name: 'Mentor: Data & AI',
        subcategories: [
          { name: 'Machine Learning & Deep Learning' },
          { name: 'Data Science & Analytics' },
          { name: 'AI Ethics & Responsible AI' },
          { name: 'NLP (Natural Language Processing)' },
          { name: 'Business Intelligence & Data Engineering' },
        ],
      },
      {
        name: 'Mentor: Product & Design',
        subcategories: [
          { name: 'Product Management' },
          { name: 'UX/UI Design & Research' },
          { name: 'Growth Hacking & Digital Marketing' },
          { name: 'Game Design & Development' },
        ],
      },
      {
        name: 'Mentor: Career & Leadership',
        subcategories: [
          { name: 'Tech Career Coaching' },
          { name: 'Technical Leadership & Management' },
          { name: 'Transitioning to an executive role (CTO, VP of Engineering)' },
          { name: 'Remote Work & Distributed Teams' },
          { name: 'Startup & Business Strategy' },
        ],
      },
      {
        name: 'Mentor: Diversity & Inclusion in Tech',
        subcategories: [
          { name: 'Women in Tech Advocacy' },
          { name: 'LGBTQ+ in Tech' },
          { name: 'Accessibility & Inclusive Product Design' },
          { name: 'Supporting BIPOC in Tech' },
        ],
      },
    ];

    // 데이터 삽입
    await Category.create({ categories });
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedCategories();