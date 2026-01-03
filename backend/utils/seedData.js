const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Faculty = require('../models/Faculty');

dotenv.config();

// CONNECT TO DB
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

// --- DATA FROM STUDENT HANDBOOK ---
const universityStructure = [
  {
    name: "Faculty of Computing",
    departments: [
      {
        name: "Department of Computer Science",
        courses: [
          // LEVEL 100 - First Semester
          { name: "CSC1201 - Introduction to Computer Science" },
          { name: "ITC1303 - Foundation of Web Programming" },
          { name: "PHY1310 - General Physics I" },
          { name: "MTH1301 - Elementary Mathematics I" },
          
          // LEVEL 100 - Second Semester
          { name: "CSC1302 - Introduction to Problem Solving" },
          { name: "CSC1211 - Introduction to ICT" },
          { name: "MTH1302 - Elementary Mathematics II (Calculus)" },

          // LEVEL 200 - First Semester
          { name: "CSC2301 - Computer Programming I" },
          { name: "CSC2203 - Discrete Structures" },
          { name: "CSC2305 - Operating Systems I" },
          { name: "CSC2311 - Systems Analysis and Design" },

          // LEVEL 200 - Second Semester
          { name: "CSC2302 - Computer Programming II" },
          { name: "CSC2206 - Computer Hardware" },
          { name: "CSC2308 - Data Management I" }
        ]
      },
      {
        name: "Department of Cyber Security",
        courses: [
          { name: "CYS201 - Intro to Cyber Security" } 
          // Admin can add more later
        ]
      }
    ]
  },
  {
    name: "Faculty of Science",
    departments: [
      {
        name: "Department of Microbiology",
        courses: [
          { name: "MCB201 - General Microbiology" }
        ]
      }
    ]
  }
];

const seedData = async () => {
  await connectDB();
  try {
    await Faculty.deleteMany(); // Clear old data
    await Faculty.insertMany(universityStructure);
    console.log("✅ Database Updated: Real Handbook Courses Added!");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedData();