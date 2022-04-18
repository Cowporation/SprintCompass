const express = require("express");
const projectRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require("mongodb").ObjectId;
const { projectsCollection, tasksCollection } = require("../config");

const validateStory = (story, res) => {
  if (!story.portion) {
    return res.status(405).send({
      msg: `error: a user story needs to contain a portion field (e.g. I want to...)`,
    });
  } else if (!story.priority) {
    return res.status(405).send({
      msg: `error: a user story needs to contain a priority field`,
    });
  } else if (!story.storyPoints) {
    return res.status(405).send({
      msg: `error: a user story needs to contain an storyPoints field`,
    });
  }
};
// define a default route to retrieve all users
projectRouter.get("/", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    let projects = await dbRtns.findAll(db, projectsCollection);
    res.status(200).send({
      projects: projects,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all projects failed - internal server error");
  }
});
// define a get route with a project id parameter
projectRouter.get("/:id", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    let o_id = new ObjectId(req.params.id);
    let queriedProject = await dbRtns.findOne(db, projectsCollection, {
      _id: o_id,
    });
    if (queriedProject) {
      res.status(200).send({
        project: queriedProject,
      });
    } else {
      res.status(404).send({
        msg: `no project found with id ${req.params.id}`,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get project failed - internal server error");
  }
});
projectRouter.post("/", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    console.log(req.body.name);
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.startDate ||
      !req.body.storyPointHours
    ) {
      return res.status(405).send({
        msg: `server received empty or invalid project data`,
      });
    }
    let stories = req.body.stories;
    let totalPoints = 0;
    let totalCost = 0;
    for (let i = 0; i < stories.length; ++i) {
      validateStory(stories[i], res);
      stories[i].estimatedCost =
        stories[i].storyPoints * req.body.storyPointHours * 65;
      totalPoints += parseInt(stories[i].storyPoints);
      totalCost += stories[i].estimatedCost;
    }

    let newProject = {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      storyPointHours: req.body.storyPointHours,
      owner: null,
      stories,
      users: [],
      totalPoints: totalPoints,
      totalCost: totalCost,
    };

    let dbresponse = await dbRtns.addOne(db, projectsCollection, newProject);
    for (let i = 0; i < stories.length; ++i) {
      stories[i].projectID = dbresponse.insertedId;
      let storyID = await dbRtns.addOne(db, tasksCollection, stories[i]);
      stories[i]._id = storyID.insertedId;
    }

    res.status(200).send({
      msg: `document added to projects collection`,
      id: dbresponse.insertedId,
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      storyPointHours: req.body.storyPointHours,
      owner: null,
      users: [],
      totalPoints: totalPoints,
      totalCost: totalCost,
      stories: stories,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("add new project failed - internal server error");
  }
});
projectRouter.put("/", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    if (!req.body.id) {
      return res.status(405).send({
        msg: `server received empty or invalid body data`,
      });
    }
    let o_id = new ObjectId(req.body.id);
    let found = await dbRtns.findOne(db, projectsCollection, {
      _id: o_id,
    });
    if (!found) {
      return res.status(404).send({
        msg: `project with ${req.body.id} does not exist`,
      });
    }
    let updateResults = await dbRtns.updateOne(
      db,
      projectsCollection,
      {
        _id: o_id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
      }
    );
    let msg;
    updateResults.lastErrorObject.updatedExisting
      ? (msg = `project ${updateResults.value.name} was updated`)
      : (msg = `project was not updated`);

    res.status(200).send({
      msg: msg,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("project update failed - internal server error");
  }
});

projectRouter.put("/user", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    if (!req.body.projectId || !req.body.userId) {
      return res.status(405).send({
        msg: `server received empty or invalid body data`,
      });
    }
    let project_o_id = new ObjectId(req.body.projectId);
    let found = await dbRtns.findOne(db, projectsCollection, {
      _id: project_o_id,
    });
    if (!found) {
      return res.status(404).send({
        msg: `project with ${req.body.projectId} does not exist`,
      });
    }
    found.users.push(req.body.userId);
    let updateResults = await dbRtns.updateOne(
      db,
      projectsCollection,
      {
        _id: project_o_id,
      },
      {
        users: found.users,
      }
    );
    let msg;
    updateResults.lastErrorObject.updatedExisting
      ? (msg = `project ${updateResults.value.name} was updated`)
      : (msg = `project was not updated`);

    res.status(200).send({
      msg: msg,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("project update failed - internal server error");
  }
});

projectRouter.delete("/:id", async (req, res) => {
  try {
    let db = await dbRtns.getDBInstance();
    let o_id = new ObjectId(req.params.id);
    let queriedProject = await dbRtns.findOne(db, projectsCollection, {
      _id: o_id,
    });
    if (queriedProject) {
      await dbRtns.deleteOne(db, projectsCollection, { _id: o_id });
      await dbRtns,dbRtns.deleteAll(db, tasksCollection, {projectID: o_id})
      res.status(200).send({
        msg: `project ${queriedProject.name} with id ${req.params.id} is deleted`,
      });
    } else {
      res.status(404).send({
        msg: `project with ${req.params.id} does not exist`,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("delete project failed - internal server error");
  }
});
module.exports = projectRouter;
