const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// JSON ফাইল পরিবেশন করার জন্য রুট তৈরি করুন
app.get('/localconfig.json', (req, res) => {
    res.sendFile(__dirname + '/localconfig.json');
});

// অন্য ফাইল পরিবেশন করুন
app.use(express.static('.'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
