const mongoose = require('mongoose');

// Define what a "Course" looks like
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Define what a "Department" looks like
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [CourseSchema]
});

// Define what a "Faculty" looks like
const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  departments: [DepartmentSchema]
});

module.exports = mongoose.model('Faculty', FacultySchema);