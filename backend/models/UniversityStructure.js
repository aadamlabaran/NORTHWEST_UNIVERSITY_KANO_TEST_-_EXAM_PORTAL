const mongoose = require('mongoose');

// 1. Schema for individual Courses
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// 2. Schema for Departments
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [CourseSchema] 
});

// 3. Schema for Faculties
const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  departments: [DepartmentSchema] 
});

// IMPORTANT: This line exports the model so other files can use .deleteMany()
module.exports = mongoose.model('UniversityStructure', FacultySchema);