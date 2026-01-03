const UniversityStructure = require('../models/UniversityStructure');

// @desc    Get all Faculties, Depts, and Courses
// @route   GET /api/structure
// @access  Public
const getStructure = async (req, res) => {
  try {
    // Fetch everything from the database
    const structure = await UniversityStructure.find({});
    res.json(structure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStructure };