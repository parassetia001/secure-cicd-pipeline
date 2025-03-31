const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Secure CI/CD Pipeline!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`App running on http://0.0.0.0:${port} and accessible externally at http://54.86.217.254:${port}`);
});