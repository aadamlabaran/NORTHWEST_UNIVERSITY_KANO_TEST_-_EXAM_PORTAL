import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear old errors

    try {
      // 1. Send the Reg Number to your Backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        regNumber: regNumber
      });

      console.log("Login Success:", response.data);
      
      // 2. Save user info so Dashboard knows who is logged in
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // 3. Go to Dashboard
      navigate('/dashboard'); 

    } catch (err) {
      // 4. If login fails
      console.error("Login Failed:", err);
      setError('Invalid Registration Number. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>NWU Exam Portal</h1>
        <p style={styles.subtitle}>Enter your Registration Number to begin</p>
        
        {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Ex: NWU/2025/CSC/001"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Start Exam
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px'
  },
  title: { color: '#003366', marginBottom: '10px' },
  subtitle: { color: '#666', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;