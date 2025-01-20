import express from 'express';
import cors from 'cors';
import env from 'dotenv'
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import config_fk from './models/config_fk.js'

env.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const corsOptions = {
  origin: 'http://localhost:5173'
}
app.use(cors(corsOptions));

config_fk();

app.use('/auth', authRoutes);
//app.use('/users', userRoutes);
app.use('/users', authMiddleware,  userRoutes);
app.use('/tasks', authMiddleware, taskRoutes);
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      console.error('JWT error:', err);
      return res.status(401).json({ error: 'Invalid token' });
  }
  next(err);
});



(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false }); 
        console.log('Database synchronized!');

        // starting the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();