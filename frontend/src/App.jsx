import React, { useState } from 'react';
import './App.css';
import logo from './logo.png'; 
import StudentPortal from './StudentPortal';
import LecturerPortal from './LecturerPortal';
import AdminPortal from './AdminPortal';

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="app-wrapper">
      {/* --- GLOBAL HEADER --- */}
      {!role && (
        <header className="hero-section">
          <div className="hero-content">
            {/* Logo on the Left */}
            <img src={logo} alt="Northwest University Logo" className="uni-logo" />
            
            {/* Text on the Right */}
            <div className="hero-text">
              <h1>Northwest University, Kano</h1>
              <p>Office of the Registrar • e-Examination & Academic Records</p>
            </div>
          </div>
        </header>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        
        {/* 1. LANDING PAGE VIEW */}
        {!role && (
          <div className="landing-container">
            <h2 className="section-title">Select Your Portal</h2>
            
            <div className="card-grid">
              {/* Student Card */}
              <div className="portal-card student-card" onClick={() => setRole('student')}>
                <div className="icon">🎓</div>
                <h3>Student Portal</h3>
                <p>Login to view results, check notifications, and take CBT exams.</p>
                <button className="enter-btn">Enter Portal &rarr;</button>
              </div>

              {/* Lecturer Card */}
              <div className="portal-card lecturer-card" onClick={() => setRole('lecturer')}>
                <div className="icon">👨‍🏫</div>
                <h3>Lecturer Portal</h3>
                <p>Manage courses, set test questions, and view student performance.</p>
                <button className="enter-btn">Enter Portal &rarr;</button>
              </div>

              {/* Admin Card */}
              <div className="portal-card admin-card" onClick={() => setRole('admin')}>
                <div className="icon">⚙️</div>
                <h3>Admin Portal</h3>
                <p>System configuration, faculty management, and user registration.</p>
                <button className="enter-btn">Enter Portal &rarr;</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PORTAL VIEWS */}
        {role && (
          <div className="portal-wrapper">
            <div className="top-bar">
               <button className="nav-back-btn" onClick={() => setRole(null)}>
                 &larr; Return to Home
               </button>
               <span className="current-portal-badge">
                 {role === 'student' ? 'Student Portal' : role === 'lecturer' ? 'Lecturer Portal' : 'Admin Panel'}
               </span>
            </div>
            
            {role === 'student' && <StudentPortal />}
            {role === 'lecturer' && <LecturerPortal />}
            {role === 'admin' && <AdminPortal />}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} <strong>Northwest University, Kano (NWU)</strong>. All Rights Reserved.</p>
        <p className="sub-footer">Powered by MIS Unit • Knowledge, Character & Service</p>
      </footer>
    </div>
  );
}

export default App;