const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

// --- HELPER FUNCTIONS ---
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const db = JSON.parse(data);
        // Ensure all arrays exist to prevent crashes
        if(!db.faculties) db.faculties = [];
        if(!db.departments) db.departments = [];
        if(!db.courses) db.courses = [];
        if(!db.exams) db.exams = [];
        if(!db.students) db.students = [];
        if(!db.lecturers) db.lecturers = [];
        if(!db.admins) db.admins = [];
        return db;
    } catch (err) {
        return { faculties: [], departments: [], courses: [], exams: [], students: [], lecturers: [], admins: [] };
    }
};

const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- ID GENERATOR LOGIC ---
function generateID(db, type, deptCode, year = '') {
    // Logic: UG + Year + Dept + Serial (e.g. UG25CSC0001)
    const prefix = type === 'student' ? `UG${year}${deptCode}` : `STAFF/${deptCode}`;
    const collection = type === 'student' ? db.students : db.lecturers;
    
    const existing = collection.filter(user => user.id.startsWith(prefix));
    const nextNum = existing.length + 1;
    const serial = String(nextNum).padStart(4, '0');
    
    return type === 'student' ? `${prefix}${serial}` : `${prefix}/${serial}`;
}

// --- PUBLIC ROUTES ---
app.get('/api/hierarchy', (req, res) => {
    const db = readDB();
    res.json({ faculties: db.faculties, departments: db.departments, courses: db.courses });
});

// --- ADMIN MANAGEMENT ROUTES (NEW) ---

// 1. Admin Login
app.post('/api/admin-login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    
    const admin = db.admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        res.json({ success: true, username: admin.username, role: admin.role });
    } else {
        res.json({ error: "Invalid Username or Password" });
    }
});

// 2. Register New Admin
app.post('/api/register-admin', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    
    // Check if username taken
    const exists = db.admins.find(a => a.username === username);
    if (exists) return res.json({ error: "Username already taken!" });

    db.admins.push({
        id: Date.now(),
        username,
        password, // In production, hash this password!
        role: "Admin"
    });
    
    saveDB(db);
    res.json({ success: true });
});

// --- SCHOOL STRUCTURE ROUTES ---
app.post('/api/add-faculty', (req, res) => {
    const db = readDB();
    const newId = db.faculties.length ? db.faculties[db.faculties.length - 1].id + 1 : 1;
    db.faculties.push({ id: newId, ...req.body }); saveDB(db); res.json({ success: true });
});

app.post('/api/add-dept', (req, res) => {
    const db = readDB();
    const newId = db.departments.length ? db.departments[db.departments.length - 1].id + 1 : 1;
    db.departments.push({ id: newId, ...req.body }); saveDB(db); res.json({ success: true });
});

// --- OFFICIAL USER REGISTRATION (Auto-ID) ---
app.post('/api/register-student', (req, res) => {
    const { name, deptId, year } = req.body;
    const db = readDB();
    const dept = db.departments.find(d => d.id == deptId);
    if(!dept) return res.json({ error: "Department not found" });

    const newID = generateID(db, 'student', dept.code, year);
    db.students.push({ id: newID, name, registeredCourses: [] });
    saveDB(db);
    res.json({ success: true, id: newID, name });
});

app.post('/api/register-lecturer', (req, res) => {
    const { name, deptId } = req.body;
    const db = readDB();
    const dept = db.departments.find(d => d.id == deptId);
    if(!dept) return res.json({ error: "Department not found" });

    const newID = generateID(db, 'lecturer', dept.code);
    db.lecturers.push({ id: newID, name, department: dept.name });
    saveDB(db);
    res.json({ success: true, id: newID, name });
});

// --- PORTAL FUNCTIONALITY ---
app.post('/api/student-login', (req, res) => {
    const { regNo } = req.body;
    const db = readDB();
    const student = db.students.find(s => s.id === regNo);
    if (!student) return res.json({ error: "Reg No not found." });
    
    const notifications = (student.registeredCourses || [])
        .filter(code => (db.exams || []).some(q => q.courseCode === code))
        .map(code => ({ course: code, message: "Assessment Active" }));
    res.json({ name: student.name, notifications });
});

app.post('/api/lecturer-login', (req, res) => {
    const { staffId } = req.body;
    const db = readDB();
    const lecturer = db.lecturers.find(l => l.id === staffId);
    if (!lecturer) return res.json({ error: "Staff ID not found." });
    res.json(lecturer);
});

app.post('/api/add-course', (req, res) => {
    const db = readDB();
    db.courses.push({ id: Date.now(), ...req.body }); saveDB(db); res.json({ success: true });
});

app.post('/api/add-question', (req, res) => {
    const db = readDB();
    db.exams.push({ id: Date.now(), ...req.body }); saveDB(db); res.json({ success: true });
});

app.get('/api/exam/:courseCode', (req, res) => {
    const db = readDB();
    const questions = (db.exams || []).filter(q => q.courseCode === req.params.courseCode);
    res.json(questions);
});

app.listen(3000, () => console.log("SERVER ONLINE: http://localhost:3000"));