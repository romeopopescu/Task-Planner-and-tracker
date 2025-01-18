// const express = require("express");
// const app = express();
// const port = 8080;
// const usersRoute = require('./routes');


// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello');
// });



// app.use('/api/v1/users', usersRoute);

// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });
const express = require('express');
const sequelize = require('./config/sequelize');
const userRoutes = require('./routes/UserRoutes');

const app = express();
const port = 8080;


app.use(express.json());


app.use('/api', userRoutes);

//start the server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    await sequelize.sync({ alter: true});
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
