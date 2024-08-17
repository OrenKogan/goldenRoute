const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });
  
app.get('/', (req, res) => {
    res.send('HELLO');
});


app.post('/api/calculate', (req, res) => {
    const { coordinates1, planeSpeed, flightRadius } = req.body;
    console.log({ coordinates1, planeSpeed, flightRadius });

    res.json({message: 'msg from server'});
});
const port = process.env.PORT || 1212

app.listen(1212, () => {
    console.log(`Server is running on port ${port}`);
});