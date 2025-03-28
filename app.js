import express from 'express';
import cors from 'cors';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import dotenv from "dotenv";
dotenv.config();


// const authRoutes = require('./auth/routes');
import authRoutes from './auth/routes.js';
// const taskRoutes = require('./routes/taskRoutes');
import swaggerDocs from './config/swaggerConfig.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));