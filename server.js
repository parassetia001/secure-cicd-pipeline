const express = require('express');
const app = express();
const port = 3000;  // Change to 3000 to match Docker port

app.get('/', (req, res) => {
    res.send('Hello, Secure CI/CD Pipeline!');
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
