const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://aadamlabaran_db_user:DPbeEPci6QvSDIBV@nwu-exams.lufvp1l.mongodb.net/NWU_Exams?retryWrites=true&w=majority&appName=NWU-Exams";
    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Connection Error:", error);
    process.exit(1);
  }
};

// NEW REG NUMBER FORMAT: UG + Year + Dept + Serial
const students = [
  {
    regNumber: "UG20CSC1001",
    fullName: "Adamu Labaran",
    department: "Computer Science",
    level: "200"
  },
  {
    regNumber: "UG20CSC1006",
    fullName: "Fatima Yusuf",
    department: "Computer Science",
    level: "200"
  },
  {
    regNumber: "UG21MCB2005",
    fullName: "Musa Ibrahim",
    department: "Microbiology",
    level: "100"
  }
];

const seedStudents = async () => {
  await connectDB();
  try {
    await Student.deleteMany(); // Remove old students with wrong reg numbers
    await Student.insertMany(students);
    console.log("✅ Students Updated with new Reg Numbers!");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedStudents();