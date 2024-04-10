
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;



app.get('/home', (req, res) => {
    res.send({ "message": "Welcome to the home page!" });
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
