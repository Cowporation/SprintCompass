require('dotenv').config();
const { port } = require("./config");
const express = require('express');
const session = require('express-session');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');

const app = express();

app.use('/project', projectRoutes);
app.use('/user', userRoutes);
app.use('/list', listRoutes);
app.use('/task', taskRoutes);
app.use('/subtask', subtaskRoutes);
app.listen(port, () => {
    console.log(`listening on port ${port}`);
   });
   
