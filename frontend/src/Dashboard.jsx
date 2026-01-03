import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [structure, setStructure] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem('user');
    if (!storedStudent) {
      navigate('/'); 
    } else {
      setStudent(JSON.parse(storedStudent));
    }

    axios.get('http://localhost:5000/api/structure')
      .then(res => setStructure(res.data))
      .catch(err => console.error("Error fetching structure:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const startAssessment = (type, courseName) => {
    const confirmStart = window.confirm(`Are you sure you want to start the ${type} for ${courseName}?`);
    if (confirmStart) {
      alert(`Starting ${type}... (Next Step: We will open the Exam Page)`);
    }
  };

  // --- NEW: Function to pick the right icon ---
  const getFacultyIcon = (name) => {
    if (name.includes("Computing")) return "💻"; // Laptop for Computing
    if (name.includes("Science")) return "🧬";   // DNA for Science
    if (name.includes("Arts")) return "🎨";      // Palette for Arts
    if (name.includes("Law")) return "⚖️";       // Scales for Law
    return "🎓"; // Default Cap
  };

  if (!student) return <div style={{padding: "20px"}}>Loading profile...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
           <div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', color: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>NWU</div>
           <div>
              <h2 style={{margin: 0, fontSize: '20px'}}>NWU Online Portal</h2>
              <p style={{margin: 0, fontSize: '12px', opacity: 0.8}}>Examination & Assessment System</p>
           </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.content}>
        
        {/* Welcome Section */}
        <div style={styles.welcomeBanner}>
          <h2>Welcome back, {student.fullName}</h2>
          <p>Registration No: <strong>{student.regNumber}</strong> | Department: <strong>{student.department}</strong></p>
        </div>

        {/* Exam Table */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📋 Available Assessments</h3>
          
          {structure.length === 0 ? <p>Loading courses...</p> : (
            structure.map(faculty => (
              <div key={faculty._id} style={{marginBottom: '30px'}}>
                
                {/* --- UPDATED HEADER WITH ICON --- */}
                <div style={styles.facultyHeaderWrapper}>
                  <span style={{fontSize: '24px', marginRight: '10px'}}>
                    {getFacultyIcon(faculty.name)}
                  </span>
                  <h4 style={styles.facultyHeader}>{faculty.name}</h4>
                </div>
                
                {faculty.departments.map(dept => (
                  <div key={dept._id} style={{marginBottom: '20px', paddingLeft: '10px'}}>
                    <div style={styles.deptHeader}>{dept.name}</div>
                    
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Course Title</th>
                          <th style={styles.th}>Continuous Assessment</th>
                          <th style={styles.th}>Final Examination</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.courses.map(course => (
                          <tr key={course._id} style={styles.tr}>
                            <td style={styles.td}><strong>{course.name}</strong></td>
                            <td style={styles.td}>
                              <button style={styles.testBtn} onClick={() => startAssessment('C.A. Test', course.name)}>
                                📝 Take C.A. Test
                              </button>
                            </td>
                            <td style={styles.td}>
                              <button style={styles.examBtn} onClick={() => startAssessment('Final Exam', course.name)}>
                                🎓 Take Exam
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { backgroundColor: '#003366', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  logoutBtn: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  content: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  welcomeBanner: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #003366', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  sectionTitle: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' },
  
  // NEW HEADER STYLES
  facultyHeaderWrapper: { display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #003366', paddingBottom: '5px' },
  facultyHeader: { color: '#003366', fontSize: '20px', textTransform: 'uppercase', margin: 0 },
  
  deptHeader: { backgroundColor: '#f1f1f1', padding: '10px', fontWeight: 'bold', fontSize: '15px', color: '#333', borderLeft: '4px solid #aaa' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '5px' },
  th: { textAlign: 'left', padding: '12px 15px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '14px' },
  td: { padding: '12px 15px', borderBottom: '1px solid #eee' },
  tr: { height: '50px' },
  testBtn: { padding: '8px 16px', backgroundColor: '#e0a800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '90%' },
  examBtn: { padding: '8px 16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '90%' }
};

export default Dashboard;