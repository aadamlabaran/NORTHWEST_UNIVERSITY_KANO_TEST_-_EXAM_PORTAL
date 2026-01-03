const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true }, // The ID (e.g. NWU/2025/CSC/001)
  fullName: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, default: '400' }, 
  isEligible: { type: Boolean, default: true } // Can they take the exam?
});

module.exports = mongoose.model('Student', StudentSchema);