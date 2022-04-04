const express = require('express');
const taskRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require('mongodb').ObjectId;
const {
    tasksCollection
} = require("../config");
// define a default route
taskRouter.get('/', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let tasks = await dbRtns.findAll(db, tasksCollection);
        res.status(200).send({
            stories: tasks
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get all stories failed - internal server error");
    }
});
// define a get route with a name parameter
taskRouter.get('/:id', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let o_id = new ObjectId(req.params.id);
        let queriedStory = await dbRtns.findOne(db, tasksCollection, {
            _id: o_id
        });
        if (queriedStory) {
            res.status(200).send({
                user: queriedStory
            });
        } else {
            res.status(404).send({
                msg: `no user found with id ${req.params.id}`
            });
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get story failed - internal server error");
    }
});
module.exports = taskRouter;