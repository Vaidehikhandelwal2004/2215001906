import React, { useState } from 'react';

function App() {
  const [inputs, setInputs] = useState([{ id: '', number: '' }]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, { id: '', number: '' }]);
  };

  const removeInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAverage(null);

    
    const data = inputs.map(({ id, number }) => ({
      id: id.trim(),
      number: Number(number),
    }));

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/numbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error calculating average');
      } else {
        setAverage(result.average);
      }
    } catch (err) {
      setError('Failed to connect to the backend');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Average Calculator</h1>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Qualified ID"
              value={input.id}
              onChange={(e) => handleInputChange(index, 'id', e.target.value)}
              required
              style={{ marginRight: 10 }}
            />
            <input
              type="number"
              placeholder="Number"
              value={input.number}
              onChange={(e) => handleInputChange(index, 'number', e.target.value)}
              required
              style={{ marginRight: 10 }}
            />
            {inputs.length > 1 && (
              <button type="button" onClick={() => removeInput(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addInput} style={{ marginRight: 10 }}>
          
        </button>
        <button type="submit">Calculate Average</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {average !== null && <p>Average: {average}</p>}
    </div>
  );
}

export default App;
