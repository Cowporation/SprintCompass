const dotenv = require("dotenv");
dotenv.config();
module.exports = {
 atlas: process.env.DBURL,
 appdb: process.env.DB,
 projectsCollection: process.env.PROJECT_COLLECTION,
 usersCollection: process.env.USER_COLLECTION,
 listsCollection: process.env.LIST_COLLECTION,
 tasksCollection: process.env.TASK_COLLECTION,
 sprintsCollection: process.env.SPRINT_COLLECTION,
 subtasksCollection: process.env.SUBTASK_COLLECTION,
 port: process.env.PORT,
};