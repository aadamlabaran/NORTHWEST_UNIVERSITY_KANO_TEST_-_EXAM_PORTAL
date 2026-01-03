import React, { useState, useEffect } from 'react';

function AdminPortal() {
  // --- STATE ---
  const [view, setView] = useState('login'); 
  const [hierarchy, setHierarchy] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Login Forms
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [newAdminForm, setNewAdminForm] = useState({ username: '', password: '' });

  // Structure Forms
  const [facultyForm, setFacultyForm] = useState({ name: '', code: '' });
  const [deptForm, setDeptForm] = useState({ facultyId: '', name: '', code: '' });
  
  // Registration Forms
  const [studentForm, setStudentForm] = useState({ regNo: '', name: '', facultyId: '', deptId: '', year: '25' });
  const [lecturerForm, setLecturerForm] = useState({ staffId: '', name: '', facultyId: '', deptId: '' });

  useEffect(() => { loadHierarchy(); }, []);

  const loadHierarchy = async () => {
    const res = await fetch('http://localhost:3000/api/hierarchy');
    const data = await res.json();
    setHierarchy(data);
  };

  // --- ADMIN AUTH ACTIONS ---

  const handleLogin = async () => {
    if(!loginForm.username || !loginForm.password) return alert("Enter credentials");

    const res = await fetch('http://localhost:3000/api/admin-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    const data = await res.json();

    if(data.success) {
        setCurrentUser(data.username);
        setView('dashboard');
    } else {
        alert(data.error);
    }
  };

  const handleRegisterAdmin = async () => {
    if(!newAdminForm.username || !newAdminForm.password) return alert("Fill all fields");
    
    const res = await fetch('http://localhost:3000/api/register-admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdminForm)
    });
    const data = await res.json();
    
    if(data.success) {
        alert(`SUCCESS! New Admin '${newAdminForm.username}' added.`);
        setNewAdminForm({ username: '', password: '' });
    } else {
        alert(data.error);
    }
  };

  // --- STRUCTURE ACTIONS ---

  const handleAddFaculty = async () => {
    if(!facultyForm.name || !facultyForm.code) return alert("Fill all fields");
    await fetch('http://localhost:3000/api/add-faculty', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(facultyForm)
    });
    alert("Faculty Added!");
    setFacultyForm({ name: '', code: '' });
    loadHierarchy();
  };

  const handleAddDept = async () => {
    if(!deptForm.facultyId || !deptForm.name) return alert("Fill all fields");
    await fetch('http://localhost:3000/api/add-dept', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(deptForm)
    });
    alert("Department Added!");
    setDeptForm({ facultyId: '', name: '', code: '' });
    loadHierarchy();
  };

  // --- USER REGISTRATION ACTIONS ---

  const handleRegisterStudent = async () => {
    if(!studentForm.name || !studentForm.deptId) return alert("Please select Department and enter Name.");
    
    const res = await fetch('http://localhost:3000/api/register-student', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        name: studentForm.name, 
        deptId: studentForm.deptId,
        year: studentForm.year 
      })
    });
    const data = await res.json();
    
    if(data.success) {
        alert(`REGISTRATION SUCCESSFUL!\n\nStudent: ${data.name}\nGenerated Reg No: ${data.id}\n\n(Write this down!)`);
        setStudentForm({ ...studentForm, name: '' }); 
    }
  };

  const handleRegisterLecturer = async () => {
    if(!lecturerForm.name || !lecturerForm.deptId) return alert("Please select Department and enter Name.");
    
    const res = await fetch('http://localhost:3000/api/register-lecturer', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        name: lecturerForm.name, 
        deptId: lecturerForm.deptId 
      })
    });
    const data = await res.json();
    
    if(data.success) {
        alert(`REGISTRATION SUCCESSFUL!\n\nLecturer: ${data.name}\nGenerated Staff ID: ${data.id}\n\n(Write this down!)`);
        setLecturerForm({ ...lecturerForm, name: '' });
    }
  };

  // --- VIEWS ---

  // 1. LOGIN
  if (view === 'login') return (
    <div className="portal-box" style={{maxWidth: '400px', margin: '50px auto', borderTop: '5px solid #2c3e50'}}>
        <div style={{fontSize:'3rem', marginBottom:'10px'}}>⚙️</div>
        <h2>Admin Access</h2>
        <p>Restricted Area. Authorized Personnel Only.</p>
        
        <div style={{textAlign:'left', marginBottom:'15px'}}>
            <label style={{fontWeight:'bold'}}>Username</label>
            <input 
                type="text" 
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                placeholder="Enter Username"
            />
        </div>

        <div style={{textAlign:'left', marginBottom:'20px'}}>
            <label style={{fontWeight:'bold'}}>Password</label>
            <input 
                type="password" 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter Password"
            />
        </div>

        <button onClick={handleLogin} style={{background: '#2c3e50'}}>Secure Login</button>
    </div>
  );

  // 2. DASHBOARD
  if (view === 'dashboard') return (
    <div className="container">
      <div className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{textAlign:'left'}}>
            <h2 style={{margin:0}}>⚙️ Admin Control Panel</h2>
            <small>Logged in as: <b>{currentUser}</b></small>
        </div>
        <button className="back-btn" onClick={() => setView('login')} style={{margin:0, background:'rgba(0,0,0,0.2)'}}>Logout</button>
      </div>

      <div className="card-grid" style={{marginTop:'20px'}}>
        <div className="card" onClick={() => setView('structure')}>
          <h3>🏗️ Manage Structure</h3>
          <p>Add Faculties & Departments</p>
        </div>
        <div className="card" onClick={() => setView('users')} style={{borderTopColor: '#f39c12'}}>
          <h3>👥 New Registration</h3>
          <p>Register Students & Lecturers</p>
        </div>
        <div className="card" onClick={() => setView('admins')} style={{borderTopColor: '#e74c3c'}}>
          <h3>🛡️ Manage Admins</h3>
          <p>Create new Admin Accounts</p>
        </div>
      </div>
    </div>
  );

  // 3. MANAGE STRUCTURE
  if (view === 'structure') return (
    <div className="container">
      <button className="back-btn" onClick={() => setView('dashboard')}>&larr; Back to Dashboard</button>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        <div className="portal-box" style={{margin:0}}>
            <h3>Add New Faculty</h3>
            <input placeholder="Faculty Name" value={facultyForm.name} onChange={e => setFacultyForm({...facultyForm, name: e.target.value})} />
            <input placeholder="Code (e.g. FOS)" value={facultyForm.code} onChange={e => setFacultyForm({...facultyForm, code: e.target.value})} />
            <button onClick={handleAddFaculty}>Create Faculty</button>
        </div>
        <div className="portal-box" style={{margin:0}}>
            <h3>Add New Department</h3>
            <select value={deptForm.facultyId} onChange={e => setDeptForm({...deptForm, facultyId: e.target.value})}>
                <option value="">-- Select Parent Faculty --</option>
                {hierarchy && hierarchy.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <input placeholder="Department Name" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} />
            <input placeholder="Code (e.g. CSC)" value={deptForm.code} onChange={e => setDeptForm({...deptForm, code: e.target.value})} />
            <button onClick={handleAddDept}>Create Department</button>
        </div>
      </div>
    </div>
  );

  // 4. MANAGE USERS (Official Registration)
  if (view === 'users') return (
    <div className="container">
      <button className="back-btn" onClick={() => setView('dashboard')}>&larr; Back to Dashboard</button>
      
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        
        {/* REGISTER STUDENT */}
        <div className="portal-box" style={{margin:0, borderTop:'5px solid #006837'}}>
            <h3>🎓 Register Student</h3>
            <p>System will generate Reg No: <b>UG[Yr][Dept][####]</b></p>
            
            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>1. Select Faculty:</label>
            <select 
                value={studentForm.facultyId} 
                onChange={e => setStudentForm({...studentForm, facultyId: e.target.value, deptId: ''})}
            >
                <option value="">-- Select Faculty --</option>
                {hierarchy && hierarchy.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>2. Select Department:</label>
            <select 
                value={studentForm.deptId} 
                disabled={!studentForm.facultyId}
                onChange={e => setStudentForm({...studentForm, deptId: e.target.value})}
            >
                <option value="">-- Select Department --</option>
                {hierarchy && hierarchy.departments
                    .filter(d => d.facultyId == studentForm.facultyId)
                    .map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>3. Year of Admission:</label>
            <select value={studentForm.year} onChange={e => setStudentForm({...studentForm, year: e.target.value})}>
                <option value="20">2020</option>
                <option value="21">2021</option>
                <option value="22">2022</option>
                <option value="23">2023</option>
                <option value="24">2024</option>
                <option value="25">2025</option>
                <option value="26">2026</option>
            </select>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>4. Student Name:</label>
            <input 
                placeholder="e.g. Sani Abba" 
                value={studentForm.name} 
                onChange={e => setStudentForm({...studentForm, name: e.target.value})} 
            />
            
            <button onClick={handleRegisterStudent} style={{marginTop:'20px'}}>Generate Reg No & Save</button>
        </div>

        {/* REGISTER LECTURER */}
        <div className="portal-box" style={{margin:0, borderTop:'5px solid #f39c12'}}>
            <h3>👨‍🏫 Register Lecturer</h3>
            <p>System will generate ID: <b>STAFF/[Dept]/[###]</b></p>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>1. Select Faculty:</label>
            <select 
                value={lecturerForm.facultyId} 
                onChange={e => setLecturerForm({...lecturerForm, facultyId: e.target.value, deptId: ''})}
            >
                <option value="">-- Select Faculty --</option>
                {hierarchy && hierarchy.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>2. Select Department:</label>
            <select 
                value={lecturerForm.deptId} 
                disabled={!lecturerForm.facultyId}
                onChange={e => setLecturerForm({...lecturerForm, deptId: e.target.value})}
            >
                <option value="">-- Select Department --</option>
                {hierarchy && hierarchy.departments
                    .filter(d => d.facultyId == lecturerForm.facultyId)
                    .map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>3. Lecturer Name:</label>
            <input 
                placeholder="e.g. Dr. Yusuf" 
                value={lecturerForm.name} 
                onChange={e => setLecturerForm({...lecturerForm, name: e.target.value})} 
            />
            
            <button onClick={handleRegisterLecturer} style={{backgroundColor:'#f39c12', marginTop:'20px'}}>Generate Staff ID & Save</button>
        </div>
      </div>
    </div>
  );

  // 5. MANAGE ADMINS (New View)
  if (view === 'admins') return (
    <div className="container">
        <button className="back-btn" onClick={() => setView('dashboard')}>&larr; Back to Dashboard</button>
        
        <div className="portal-box" style={{maxWidth:'500px', margin:'0 auto', borderTop:'5px solid #e74c3c'}}>
            <h3>🛡️ Add New Admin</h3>
            <p>Grant system access to another user.</p>

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>New Username:</label>
            <input 
                placeholder="e.g. exams_officer" 
                value={newAdminForm.username} 
                onChange={e => setNewAdminForm({...newAdminForm, username: e.target.value})} 
            />

            <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginTop:'10px'}}>New Password:</label>
            <input 
                placeholder="Enter strong password" 
                value={newAdminForm.password} 
                onChange={e => setNewAdminForm({...newAdminForm, password: e.target.value})} 
            />

            <button onClick={handleRegisterAdmin} style={{marginTop:'20px', background:'#e74c3c'}}>Create Admin Account</button>
        </div>
    </div>
  );
}

export default AdminPortal;