const express = require("express");
const app = express();
const port = 8080;
const usersRoute = require('./src/user/routes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/api/v1/users', usersRoute);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});