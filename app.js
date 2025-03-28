const express = require('express');
const cors = require('cors');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const taskRoutes = require('./routes/taskRoutes');
const swaggerDocs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));