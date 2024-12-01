import React, { useState } from 'react';

function App() {
  const [number, setNumber] = useState('');
  const [verbResponse, setVerbResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Specify the type for the event parameter
  const handleVerbRequest = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setVerbResponse(data.verbs);
    } catch (err) {
      // Type assertion for the error to access the message property
      if (err instanceof Error) {
        setError('Error: ' + err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>German Verbs Practice</h1>
      <form onSubmit={handleVerbRequest}>
        <label>
          Enter number of verbs:
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {verbResponse && <p>{verbResponse}</p>}
    </div>
  );
}

export default App;
