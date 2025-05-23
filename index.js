const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Secure CI/CD Pipeline!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and accessible externally at http://54.86.217.254:${PORT}`);
});