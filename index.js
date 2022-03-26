require('dotenv').config();
const { port } = require("./config");
const cors = require("cors")
const express = require('express');
const session = require('express-session');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');

const app = express();
app.use(cors());
// parse application/json
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/project', projectRoutes);
app.use('/user', userRoutes);
app.use('/list', listRoutes);
app.use('/task', taskRoutes);
app.use('/subtask', subtaskRoutes);
app.listen(port, () => {
    console.log(`listening on port ${port}`);
   });
   
