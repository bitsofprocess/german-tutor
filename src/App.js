import React, { useState } from 'react';

function App() {
  const [number, setNumber] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/openai/verbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setResponse(data.verbs);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>German Verbs Practice</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter number of verbs:
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && <p>{response}</p>}
    </div>
  );
}

export default App;
