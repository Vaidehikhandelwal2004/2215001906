const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());


function isValidQualifiedId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
}

app.post('/numbers', (req, res) => {
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Request body must be an array of objects with id and number' });
  }

  let sum = 0;
  let count = 0;

  for (const item of data) {
    if (!item.id || !isValidQualifiedId(item.id)) {
      return res.status(400).json({ error: `Invalid or missing qualified id: ${item.id}` });
    }
    if (typeof item.number !== 'number') {
      return res.status(400).json({ error: `Invalid or missing number for id: ${item.id}` });
    }
    sum += item.number;
    count++;
  }

  if (count === 0) {
    return res.status(400).json({ error: 'No valid numbers provided' });
  }

  const average = sum / count;

  res.json({ average });
});

app.listen(port, () => {
  console.log(`Average calculator backend listening at http://localhost:${port}`);
});
