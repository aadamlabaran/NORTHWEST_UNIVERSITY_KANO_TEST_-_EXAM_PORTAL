const express = require('express');
const router = express.Router();
const { getStructure } = require('../controllers/structureController');

// When someone goes to this URL, run the 'getStructure' function
router.get('/', getStructure);

module.exports = router;