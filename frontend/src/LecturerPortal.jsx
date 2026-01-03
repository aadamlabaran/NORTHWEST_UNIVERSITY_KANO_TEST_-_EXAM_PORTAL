import React, { useState, useEffect } from 'react';

function LecturerPortal() {
  // --- STATE ---
  const [view, setView] = useState('login'); 
  const [staffId, setStaffId] = useState(''); // Only need ID now
  
  const [lecturer, setLecturer] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  
  // Dashboard Selections
  const [assessmentType, setAssessmentType] = useState('Exam'); 
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  
  // "Add New Course" State
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', unit: 2 });

  // Question Form
  const [questionForm, setQuestionForm] = useState({
    question: '', optA: '', optB: '', optC: '', optD: '', correct: 'A'
  });

  // --- ACTIONS ---

  const handleLogin = async () => {
    if(!staffId) return alert("Please enter your Staff ID.");

    // 1. Send ONLY the ID to the server
    const res = await fetch('http://localhost:3000/api/lecturer-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ staffId })
    });
    const data = await res.json();
    
    if (data.error) {
        alert(data.error); // "Staff ID not found"
    } else {
        // 2. Login Successful - System knows the Dept automatically
        setLecturer(data);
        loadHierarchy(); // Load the dropdowns for the Dashboard
        setView('dashboard');
    }
  };

  const loadHierarchy = async () => {
    const res = await fetch('http://localhost:3000/api/hierarchy');
    const data = await res.json();
    setHierarchy(data);
  };

  const handleCreateCourse = async () => {
    if (!newCourse.code || !newCourse.title) return alert("Please fill in Course Code and Title");

    const res = await fetch('http://localhost:3000/api/add-course', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deptId: selectedDeptId,
        code: newCourse.code,
        title: newCourse.title,
        unit: newCourse.unit
      })
    });
    const data = await res.json();
    if(data.success) {
      alert(`Course ${newCourse.code} created!`);
      await loadHierarchy(); 
      setSelectedCourseCode(newCourse.code); 
      setIsAddingCourse(false); 
    }
  };

  const handleSubmitQuestion = async () => {
    if(!selectedCourseCode && !isAddingCourse) return alert("Please select a course.");
    if(isAddingCourse) return alert("Please click 'Save New Course' first.");

    const payload = {
      courseCode: selectedCourseCode,
      type: assessmentType, 
      question: questionForm.question,
      options: [questionForm.optA, questionForm.optB, questionForm.optC, questionForm.optD],
      correct: questionForm.correct
    };

    await fetch('http://localhost:3000/api/add-question', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    
    alert(`Saved to ${selectedCourseCode} (${assessmentType})`);
    setQuestionForm({ ...questionForm, question: '', optA: '', optB: '', optC: '', optD: '' });
  };

  // --- VIEWS ---

  if (view === 'login') return (
    <div className="portal-box">
      <h2>Lecturer Login</h2>
      <p style={{marginBottom:'20px', color:'#666'}}>Enter your Staff ID to proceed.</p>
      
      {/* SIMPLE LOGIN FORM - ID ONLY */}
      <div style={{textAlign:'left', marginBottom:'20px'}}>
        <label style={{fontWeight:'bold'}}>Staff ID</label>
        <input 
            placeholder="e.g. LECT/555" 
            value={staffId} 
            onChange={e => setStaffId(e.target.value)} 
        />
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );

  return (
    <div className="container">
      <div className="header" style={{textAlign:'left', padding:'1rem 2rem', display:'flex', justifyContent:'space-between'}}>
        <div>
            <h2 style={{margin:0}}>👨‍🏫 {lecturer.name}</h2>
            {/* System displays the correct Dept automatically */}
            <small>{lecturer.department}</small> 
        </div>
        <button className="back-btn" onClick={() => window.location.reload()} style={{margin:0, background:'rgba(0,0,0,0.2)'}}>Logout</button>
      </div>

      <div className="portal-box" style={{maxWidth: '800px', textAlign:'left'}}>
        
        {/* --- STEP 1: TEST OR EXAM? --- */}
        <div style={{background:'#e8f5e9', padding:'15px', borderRadius:'8px', marginBottom:'20px', border:'1px solid #006837'}}>
            <h3 style={{marginTop:0, color:'#006837'}}>1. What are you setting?</h3>
            <div style={{display:'flex', gap:'20px'}}>
                <label style={{fontWeight:'bold', cursor:'pointer'}}>
                    <input type="radio" checked={assessmentType === 'Test'} onChange={() => setAssessmentType('Test')} /> 
                    Continuous Assessment (Test)
                </label>
                <label style={{fontWeight:'bold', cursor:'pointer'}}>
                    <input type="radio" checked={assessmentType === 'Exam'} onChange={() => setAssessmentType('Exam')} /> 
                    Final Examination
                </label>
            </div>
        </div>

        {/* --- STEP 2: LOCATION --- */}
        <h3>2. Select Target Class</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
            <div>
                <label>Faculty</label>
                <select value={selectedFacultyId} onChange={e => { setSelectedFacultyId(e.target.value); setSelectedDeptId(''); }}>
                    <option value="">-- Select Faculty --</option>
                    {hierarchy && hierarchy.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
            </div>
            <div>
                <label>Department</label>
                <select value={selectedDeptId} disabled={!selectedFacultyId} onChange={e => { setSelectedDeptId(e.target.value); setSelectedCourseCode(''); }}>
                    <option value="">-- Select Department --</option>
                    {hierarchy && hierarchy.departments
                        .filter(d => d.facultyId == selectedFacultyId)
                        .map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
        </div>

        {/* --- STEP 3: COURSE SELECTION --- */}
        <label style={{marginTop:'15px', display:'block'}}>Course</label>
        <select 
            value={isAddingCourse ? "NEW" : selectedCourseCode} 
            disabled={!selectedDeptId}
            onChange={e => {
                if(e.target.value === "NEW") {
                    setIsAddingCourse(true);
                    setSelectedCourseCode('');
                } else {
                    setIsAddingCourse(false);
                    setSelectedCourseCode(e.target.value);
                }
            }}
        >
            <option value="">-- Select Course --</option>
            {hierarchy && hierarchy.courses
                .filter(c => c.deptId == selectedDeptId)
                .map(c => <option key={c.id} value={c.code}>{c.code} - {c.title}</option>)}
            <option value="NEW" style={{fontWeight:'bold', color:'blue'}}>+ Add New Course...</option>
        </select>

        {/* --- ADD NEW COURSE FORM --- */}
        {isAddingCourse && (
            <div style={{background:'#fff3cd', padding:'15px', marginTop:'10px', borderRadius:'8px', border:'1px solid #f39c12'}}>
                <h4 style={{marginTop:0, color:'#856404'}}>Add Missing Course</h4>
                <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 1fr', gap:'10px'}}>
                    <input placeholder="Code (e.g. PHY101)" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
                    <input placeholder="Title (e.g. General Physics)" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                    <input type="number" placeholder="Units" value={newCourse.unit} onChange={e => setNewCourse({...newCourse, unit: e.target.value})} />
                </div>
                <button onClick={handleCreateCourse} style={{background:'#f39c12', marginTop:'10px'}}>Save New Course</button>
                <button onClick={() => setIsAddingCourse(false)} style={{background:'#666', marginLeft:'10px'}}>Cancel</button>
            </div>
        )}

        {/* --- STEP 4: QUESTION FORM --- */}
        {(selectedCourseCode || isAddingCourse) && !isAddingCourse && (
          <div style={{marginTop: '30px', borderTop:'2px solid #eee', paddingTop:'20px'}}>
            <h3 style={{color: '#006837'}}>
                3. Add {assessmentType} Question for {selectedCourseCode}
            </h3>
            
            <textarea rows="3" placeholder="Enter Question Text..." value={questionForm.question} onChange={e => setQuestionForm({...questionForm, question: e.target.value})} />
            
            <div className="options-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <input placeholder="Option A" value={questionForm.optA} onChange={e => setQuestionForm({...questionForm, optA: e.target.value})} />
              <input placeholder="Option B" value={questionForm.optB} onChange={e => setQuestionForm({...questionForm, optB: e.target.value})} />
              <input placeholder="Option C" value={questionForm.optC} onChange={e => setQuestionForm({...questionForm, optC: e.target.value})} />
              <input placeholder="Option D" value={questionForm.optD} onChange={e => setQuestionForm({...questionForm, optD: e.target.value})} />
            </div>
            
            <label>Correct Answer:</label>
            <select value={questionForm.correct} onChange={e => setQuestionForm({...questionForm, correct: e.target.value})}>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
            
            <button onClick={handleSubmitQuestion} style={{width:'100%', padding:'15px', fontSize:'1.1rem'}}>Save Question to Database</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturerPortal;