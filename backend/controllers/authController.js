const Student = require('../models/Student');

// @desc    Login Student
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  const { regNumber } = req.body;

  try {
    // Search for the student in the database
    const student = await Student.findOne({ regNumber });

    if (student) {
      res.json({
        _id: student._id,
        regNumber: student.regNumber,
        fullName: student.fullName,
        department: student.department
      });
    } else {
      res.status(401).json({ message: 'Invalid Registration Number' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginStudent };