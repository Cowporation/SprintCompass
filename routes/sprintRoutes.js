const express = require('express');
const sprintRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require('mongodb').ObjectId;
const {
    sprintsCollection,
    tasksCollection
} = require("../config");
sprintRouter.get('/', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let sprints = await dbRtns.findAll(db, sprintsCollection);
        res.status(200).send({
            sprints: sprints
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get all sprints failed - internal server error");
    }
});
// define a get route with a name parameter
sprintRouter.get('/:id', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let o_id = new ObjectId(req.params.id);
        let queriedSprint = await dbRtns.findOne(db, sprintsCollection, {
            _id: o_id
        });

        if (queriedSprint) {
            let stories = await dbRtns.findAll(db, tasksCollection, {
                belongsToID: req.params.id,
            });
            console.log(stories);
            queriedSprint.stories = stories;
            res.status(200).send({
                sprint: queriedSprint
            });
        } else {
            res.status(404).send({
                msg: `no sprint found with id ${req.params.id}`
            });
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get sprint failed - internal server error");
    }
});
sprintRouter.post("/", async (req, res) => {

    try {
        let db = await dbRtns.getDBInstance();
        let newSprint = {
            name: req.body.name,

        }
        if (!newSprint.name) {
            return res.status(405).send({
                msg: `server received empty or invalid sprint data`
            });
        }
        let dbresponse = await dbRtns.addOne(db, sprintsCollection, newSprint);
        res.status(200).send({
            msg: `new sprint added to sprints collection`,
            id: dbresponse.insertedId
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send({
            msg: "add new user failed - internal server error"
        });
    }
});
module.exports = sprintRouter;