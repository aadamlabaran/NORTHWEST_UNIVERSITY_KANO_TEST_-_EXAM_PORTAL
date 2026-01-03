import React, { useState, useEffect } from 'react';

function StudentPortal() {
  // --- STATE ---
  const [view, setView] = useState('login'); // login, dashboard, browse, exam, result
  const [regNo, setRegNo] = useState('');
  const [studentData, setStudentData] = useState(null);
  
  // Browsing Data
  const [hierarchy, setHierarchy] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Exam Logic
  const [examQuestions, setExamQuestions] = useState([]);
  const [examType, setExamType] = useState(''); 
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  // --- ICON HELPER ---
  const getIcon = (name) => {
    if (name.includes("Computing")) return "💻";
    if (name.includes("Science") && !name.includes("Social")) return "🔬";
    if (name.includes("Education")) return "📚";
    if (name.includes("Humanities") || name.includes("Arts")) return "🎨";
    if (name.includes("Social") || name.includes("Management")) return "📊";
    if (name.includes("Medical") || name.includes("Clinical") || name.includes("Anatomy")) return "🏥";
    if (name.includes("Law")) return "⚖️";
    if (name.includes("History")) return "📜";
    if (name.includes("English") || name.includes("Languages")) return "🗣️";
    if (name.includes("Cyber")) return "🛡️";
    if (name.includes("Software")) return "💾";
    return "🎓"; // Default
  };

  // --- ACTIONS ---

  const handleLogin = async () => {
    if (!regNo) return alert("Please enter your Registration Number.");

    const res = await fetch('http://localhost:3000/api/student-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ regNo })
    });
    const data = await res.json();
    
    if (data.error) {
        alert(data.error);
    } else {
        setStudentData(data);
        loadHierarchy(); // Load school structure for browsing
        setView('dashboard');
    }
  };

  const loadHierarchy = async () => {
    const res = await fetch('http://localhost:3000/api/hierarchy');
    const data = await res.json();
    setHierarchy(data);
  };

  const startAssessment = async (code, type) => {
    if(!confirm(`Are you ready to start the ${type} for ${code}?`)) return;
    
    const res = await fetch(`http://localhost:3000/api/exam/${code}`);
    const allQuestions = await res.json();
    
    // Filter questions by type (Test vs Exam)
    const filtered = allQuestions.filter(q => q.type === type);
    
    if(filtered.length === 0) return alert(`No ${type} questions found for ${code}.`);

    setExamQuestions(filtered);
    setExamType(type);
    setView('exam');
  };

  const submitExam = () => {
    let tempScore = 0;
    examQuestions.forEach(q => {
      if (answers[q.id] === q.correct) tempScore++;
    });
    setScore(tempScore);
    setView('result');
  };

  // --- VIEWS ---

  // 1. LOGIN SCREEN
  if (view === 'login') return (
    <div className="portal-box">
      <div style={{fontSize:'3rem', marginBottom:'10px'}}>🎓</div>
      <h2>Student Portal</h2>
      <p style={{color:'#666', marginBottom:'20px'}}>Enter your Official Reg No to access exams.</p>
      
      <div style={{textAlign:'left', marginBottom:'20px'}}>
        <label style={{fontWeight:'bold'}}>Registration Number</label>
        <input 
            placeholder="e.g. UG25CSC0001" 
            value={regNo} 
            onChange={e => setRegNo(e.target.value.toUpperCase())} // <-- FIXED: Forces uppercase
            style={{fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase'}}
        />
      </div>
      <button onClick={handleLogin}>Secure Login</button>
    </div>
  );

  // 2. DASHBOARD
  if (view === 'dashboard') return (
    <div className="container">
      <div className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{textAlign:'left'}}>
            <h2 style={{margin:0}}>👋 Welcome, {studentData.name}</h2>
            <small style={{opacity:0.8}}>Reg No: {regNo}</small>
        </div>
        <button className="back-btn" onClick={() => window.location.reload()} style={{margin:0, background:'rgba(0,0,0,0.2)'}}>Logout</button>
      </div>

      {/* DASHBOARD GRID */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
        
        {/* PANEL A: NOTIFICATIONS */}
        <div className="portal-box" style={{margin:0, borderTop:'5px solid #f39c12'}}>
            <h3>🔔 Active Assessments</h3>
            {studentData.notifications.length === 0 ? (
                <p style={{color:'#888', fontStyle:'italic'}}>No active exams for your registered courses.</p>
            ) : (
                studentData.notifications.map(n => (
                    <div key={n.course} className="notif-item">
                        <span style={{fontWeight:'bold'}}>{n.course}</span>
                        <div style={{display:'flex', gap:'5px'}}>
                            <button style={{padding:'5px 10px', fontSize:'0.8rem'}} onClick={() => startAssessment(n.course, 'Test')}>Test</button>
                            <button style={{padding:'5px 10px', fontSize:'0.8rem', background:'#d9534f'}} onClick={() => startAssessment(n.course, 'Exam')}>Exam</button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* PANEL B: BROWSER */}
        <div className="portal-box" style={{margin:0, borderTop:'5px solid #006837', cursor:'pointer'}} onClick={() => setView('browse')}>
            <div style={{fontSize:'3rem'}}>📂</div>
            <h3>Browse School Directory</h3>
            <p>Navigate Faculties & Departments manually to find assessments.</p>
            <button style={{marginTop:'10px'}}>Open Directory</button>
        </div>
      </div>
    </div>
  );

  // 3. BROWSER (The Professional Hierarchy)
  if (view === 'browse' && hierarchy) return (
    <div className="container">
      <div className="header" style={{textAlign:'left', padding:'1rem'}}>
        <button className="back-btn" onClick={() => setView('dashboard')} style={{marginBottom:0, marginRight:'15px', background:'rgba(0,0,0,0.2)'}}>&larr;</button>
        <span style={{fontSize:'1.2rem', fontWeight:'bold'}}>School Directory</span>
      </div>
      
      {/* LEVEL 1: FACULTIES */}
      {!selectedFaculty && (
        <div>
          <h2 style={{marginTop:'20px', borderBottom:'2px solid #ddd'}}>🏛️ Select Faculty</h2>
          <div className="card-grid">
            {hierarchy.faculties.map(f => (
              <div key={f.id} className="card" onClick={() => setSelectedFaculty(f)} style={{textAlign:'center'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>{getIcon(f.name)}</div>
                <h3>{f.name}</h3>
                <small style={{color:'#666'}}>{f.code}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEVEL 2: DEPARTMENTS */}
      {selectedFaculty && !selectedDept && (
        <div>
          <button className="back-btn" onClick={() => setSelectedFaculty(null)} style={{background:'#999'}}>Back to Faculties</button>
          <h2 style={{marginTop:'10px'}}>{getIcon(selectedFaculty.name)} {selectedFaculty.name}</h2>
          <p>Select your Department:</p>
          <div className="card-grid">
            {hierarchy.departments
              .filter(d => d.facultyId === selectedFaculty.id)
              .map(d => (
                <div key={d.id} className="card" onClick={() => setSelectedDept(d)}>
                  <div style={{fontSize:'2rem', marginBottom:'10px'}}>{getIcon(d.name)}</div>
                  <h3>{d.name}</h3>
                  <small>{d.code}</small>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* LEVEL 3: COURSES */}
      {selectedDept && !selectedCourse && (
        <div>
           <button className="back-btn" onClick={() => setSelectedDept(null)} style={{background:'#999'}}>Back to Departments</button>
           <h2 style={{marginTop:'10px'}}>{getIcon(selectedDept.name)} {selectedDept.name}</h2>
           <p>Available Courses:</p>
           <div className="card-grid">
            {hierarchy.courses
              .filter(c => c.deptId === selectedDept.id)
              .map(c => (
                <div key={c.id} className="card" onClick={() => setSelectedCourse(c)}>
                  <h3>{c.code}</h3>
                  <p>{c.title}</p>
                </div>
            ))}
           </div>
        </div>
      )}

      {/* LEVEL 4: ACTION */}
      {selectedCourse && (
        <div className="portal-box">
          <button className="back-btn" onClick={() => setSelectedCourse(null)} style={{background:'#999'}}>Back</button>
          <h2>{selectedCourse.code}</h2>
          <p>{selectedCourse.title}</p>
          <hr />
          <h3>Select Assessment Type:</h3>
          <div style={{display:'flex', gap:'20px', justifyContent:'center', marginTop:'20px'}}>
            <button style={{backgroundColor:'#f39c12', padding:'15px 30px'}} onClick={() => startAssessment(selectedCourse.code, 'Test')}>
                📝 Take Test
            </button>
            <button style={{backgroundColor:'#d9534f', padding:'15px 30px'}} onClick={() => startAssessment(selectedCourse.code, 'Exam')}>
                🎓 Take Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // 4. EXAM HALL
  if (view === 'exam') return (
    <div className="exam-hall">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', padding:'15px', borderRadius:'8px', marginBottom:'20px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin:0}}>{selectedCourse ? selectedCourse.code : 'Assessment'} - {examType}</h2>
        <span style={{color:'red', fontWeight:'bold', border:'1px solid red', padding:'5px 10px', borderRadius:'5px'}}>Time: Active</span>
      </div>
      
      {examQuestions.map((q, idx) => (
        <div key={q.id} className="question-card">
          <h4>{idx + 1}. {q.question}</h4>
          {q.options.map((opt, i) => {
            const label = ["A", "B", "C", "D"][i];
            return (
              <label key={opt} style={{display:'block', margin:'10px 0', padding:'10px', border:'1px solid #eee', borderRadius:'5px'}}>
                <input 
                  type="radio" 
                  name={`q-${q.id}`} 
                  value={label}
                  onChange={() => setAnswers({...answers, [q.id]: label})}
                  style={{marginRight:'10px'}}
                /> 
                <b>{label})</b> {opt}
              </label>
            )
          })}
        </div>
      ))}
      <button className="submit-btn" onClick={submitExam} style={{width:'100%', padding:'15px', fontSize:'1.2rem'}}>Submit {examType}</button>
    </div>
  );

  // 5. RESULT
  if (view === 'result') return (
    <div className="portal-box">
      <div style={{fontSize:'4rem', color:'#006837'}}>✅</div>
      <h1 style={{color: '#006837'}}>Assessment Submitted</h1>
      <p>Your answers have been recorded.</p>
      <div style={{background:'#f4f4f4', padding:'20px', borderRadius:'10px', margin:'20px 0'}}>
        <h2>Score: {score} / {examQuestions.length}</h2>
        <p>Percentage: {((score/examQuestions.length)*100).toFixed(1)}%</p>
      </div>
      <button onClick={() => window.location.reload()}>Return to Dashboard</button>
    </div>
  );
}

export default StudentPortal;