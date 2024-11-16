

import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebaseConfig';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  button: {
    width: '150px',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [leadData, setLeadData] = useState({ companyName: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);
  const [error, setError] = useState(null);

  // Handle Google Sign-In
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  // Handle Lead Form Input
  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  // Fetch Enriched Data from Backend API
  const fetchEnrichedData = async () => {
    if (!leadData.companyName || !leadData.website) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setEnrichedData(null);

    try {
      const response = await fetch('http://localhost:5000/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to retrieve enriched data.');
      }

      const data = await response.json();
      setEnrichedData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Lead Enrichment Preview Tool</h1>

      {/* Google Login Button */}
      {!user ? (
        <button onClick={handleLogin} style={{ display: 'flex',
        alignItems: 'center', // Vertically centers items
        justifyContent: 'center', // Horizontally centers content
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#555',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
        gap: '10px',  }}>
          <img
            src="google.png"
             alt="Google Login"
            style={{
              width: '170px',   // Fill the width of the container
     height: '50px',  // Fill the height of the container
     objectFit: 'cover',  // Ensures the image covers the box
     marginRight: '10px',
            }}
          />
          Log in with Google
        </button>
      ) : (
        <p>Welcome, {user.displayName}</p>
      )}

      {/* Lead Capture Form */}
      {user && (
        <div>
          <h2 style={styles.heading}>Enter Lead Information</h2>
          <input
            type="text"
            placeholder="Company Name"
            name="companyName"
            style={styles.input}
            value={leadData.companyName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Website URL"
            name="website"
            style={styles.input}
            value={leadData.website}
            onChange={handleChange}
          />
          <button style={styles.button} onClick={fetchEnrichedData}>
            Submit
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Enriched Data */}
      {enrichedData && (
        <div>
          <h2>Enriched Lead Data</h2>
          <pre>{JSON.stringify(enrichedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
