const express = require('express');
const taskRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require('mongodb').ObjectId;
const {
    tasksCollection,
    sprintsCollection
} = require("../config");
// define a default route
const guid = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
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
  taskRouter.put("/addsubtask", async (req, res) => {
    try {
      let db = await dbRtns.getDBInstance();
      if (!req.body.id ||!req.body.subtask) {
        return res.status(405).send({
          msg: `server received empty or invalid body data`,
        });
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
      let subtask = {
        name: req.body.subtask,
        _id: guid(),
        workedby: []
      };
      let subtasks = [];
      if(foundStory.subtasks){
        subtasks = foundStory.subtasks;
      }
      subtasks.push(subtask);
      let updateResults = await dbRtns.updateOne(
        db,
        tasksCollection,
        {
          _id: story_o_id,
        },
        {
          subtasks: subtasks
        }
      );
      let msg;
      updateResults.lastErrorObject.updatedExisting
        ? (msg = `subtask ${subtask._id} was added to ${req.body.id}`)
        : (msg = `story was not updated`);
  
      res.status(200).send({
        msg: msg,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("story update failed - internal server error");
    }
  });

  taskRouter.put("/updatesubtask", async (req, res) => {
    try {
      let db = await dbRtns.getDBInstance();
      if (!req.body.storyid ||!req.body.subtaskid || !req.body.subtask) {
        return res.status(405).send({
          msg: `server received empty or invalid body data`,
        });
      }
      let story_o_id = new ObjectId(req.body.storyid);
      let foundStory = await dbRtns.findOne(db, tasksCollection, {
        _id: story_o_id,
      });
      if (!foundStory) {
        return res.status(404).send({
          msg: `story with ${req.body.storyid} does not exist`,
        });
      }
      let index = foundStory.subtasks?.findIndex(subtask => subtask._id === req.body.subtaskid);
      if(index === -1){
        return res.status(404).send({
          msg: `subtask with ${req.body.subtaskid} does not exist`,
        });
      }
      let projection = {};
      projection["subtasks." + index] = req.body.subtask;
      let updateResults = await dbRtns.updateOne(
        db,
        tasksCollection,
        {
          _id: story_o_id,
        },
        projection
      );
      let msg;
      updateResults.lastErrorObject.updatedExisting
        ? (msg = `subtask ${req.body.subtaskid} was updated`)
        : (msg = `subtask was not updated`);
  
      res.status(200).send({
        msg: msg,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("story update failed - internal server error");
    }
  });
module.exports = taskRouter;