import React, { useState } from 'react';

function App() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Specify the type for the event parameter
  // const handleVerbRequest = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const res = await fetch('http://localhost:4000/openai/verbs', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ number }),
  //     });

  //     if (!res.ok) throw new Error('Network response was not ok');

  //     const data = await res.json();
  //     setVerbResponse(data.verbs);
  //   } catch (err) {
  //     // Type assertion for the error to access the message property
  //     if (err instanceof Error) {
  //       setError('Error: ' + err.message);
  //     } else {
  //       setError('An unknown error occurred');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRequest = async (concept: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/openai/translationPractice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "concept": concept }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      console.log(data);
      setResponse(data.sentence.german);
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
      <h1>German Tutor</h1>
      <button type="submit"  onClick={() => handleRequest("separable verbs")}>Separable verbs</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && <p>{response}</p>} 
    </div>
  );
}

export default App;
