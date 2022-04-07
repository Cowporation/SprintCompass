const express = require('express');
const taskRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require('mongodb').ObjectId;
const {
    tasksCollection,
    sprintsCollection
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
taskRouter.put("/movetolist", async (req, res) => {
    try {
      let db = await dbRtns.getDBInstance();
      if (!req.body.id || !req.body.sprintId) {
        return res.status(405).send({
          msg: `server received empty or invalid body data`,
        });
      }
      let belongsTo;
      let belongsToID;
      if(req.body.sprintId === "Backlog"){
        belongsTo = "Backlog";
        belongsToID = null;
      }else{
         let sprint_o_id = new ObjectId(req.body.sprintId); 
         let foundSprint = await dbRtns.findOne(db, sprintsCollection, {
            _id: sprint_o_id,
          });
         if (!foundSprint) {
            return res.status(404).send({
              msg: `sprint with ${req.body.sprintId} does not exist`,
            });
          }
          belongsTo = foundSprint.name;
          belongsToID = req.body.sprintId;
      }
      let story_o_id = new ObjectId(req.body.id);
      let foundStory = await dbRtns.findOne(db, tasksCollection, {
        _id: story_o_id,
      });
      if (!foundStory) {
        return res.status(404).send({
          msg: `story with ${req.body.id} does not exist`,
        });
      }
      let updateResults = await dbRtns.updateOne(
        db,
        tasksCollection,
        {
          _id: story_o_id,
        },
        {
            belongsTo : belongsTo,
            belongsToID : belongsToID 
        }
      );
      let msg;
      updateResults.lastErrorObject.updatedExisting
        ? (msg = `story ${updateResults.value._id} was added to ${belongsTo}`)
        : (msg = `story was not updated`);
  
      res.status(200).send({
        msg: msg,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("story update failed - internal server error");
    }
  });
module.exports = taskRouter;