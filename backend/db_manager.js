const fs = require('fs');
const path = './database.json';

// 1. Helper to Read Database
function readDB() {
    if (!fs.existsSync(path)) return { faculties: [], departments: [], exams: [], students: [] };
    const data = fs.readFileSync(path);
    const json = JSON.parse(data);
    
    // Ensure all arrays exist to avoid crashes
    if (!json.faculties) json.faculties = [];
    if (!json.departments) json.departments = [];
    if (!json.exams) json.exams = [];
    if (!json.students) json.students = [];
    
    return json;
}

// 2. Helper to Save Database
function saveDB(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// --- ADMIN FUNCTIONS ---
function getFaculties() { return readDB().faculties; }

function addDepartment(facultyId, name, code) {
    const db = readDB();
    const newId = db.departments.length > 0 ? db.departments[db.departments.length - 1].id + 1 : 1;
    db.departments.push({ id: newId, faculty_id: facultyId, name: name, code: code });
    saveDB(db);
}

// --- LECTURER FUNCTIONS ---
function addExamQuestion(courseCode, question, options, correctOption) {
    const db = readDB();
    const newQuestion = {
        id: Date.now(), // Generate unique ID based on time
        courseCode: courseCode,
        question: question,
        options: options,
        correct: correctOption
    };
    db.exams.push(newQuestion);
    saveDB(db);
}

// --- STUDENT FUNCTIONS ---
function getCourseExam(courseCode) {
    const db = readDB();
    // Return only questions for the requested course
    return db.exams.filter(q => q.courseCode === courseCode);
}

function getStudentNotifications(regNo) {
    const db = readDB();
    const student = db.students.find(s => s.id === regNo);
    
    if (!student) return { error: "Student Registration Number not found." };

    // Check which of their registered courses have active exams in the database
    const notifications = [];
    student.registeredCourses.forEach(code => {
        const hasExam = db.exams.some(q => q.courseCode === code);
        if (hasExam) {
            notifications.push({
                course: code,
                message: `The exam for ${code} is live. Click to start.`
            });
        }
    });

    return { name: student.name, notifications: notifications };
}

module.exports = { getFaculties, addDepartment, addExamQuestion, getCourseExam, getStudentNotifications };