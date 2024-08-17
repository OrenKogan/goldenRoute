const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'msg from server'});
});

const port = process.env.PORT || 8080

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});