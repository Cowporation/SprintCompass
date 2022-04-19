const express = require('express');
const userRouter = express.Router();
const dbRtns = require("../dbroutines");
const ObjectId = require('mongodb').ObjectId;
const {
    usersCollection
} = require("../config");
// define a default route
userRouter.get('/', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let users = await dbRtns.findAll(db, usersCollection);
        res.status(200).send({
            users: users
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get all users failed - internal server error");
    }
});
// define a get route with a name parameter
userRouter.get('/:id', async (req, res) => {
    try {
        let db = await dbRtns.getDBInstance();
        let o_id = new ObjectId(req.params.id);
        let queriedUser = await dbRtns.findOne(db, usersCollection, {
            _id: o_id
        });
        if (queriedUser) {
            res.status(200).send({
                user: queriedUser
            });
        } else {
            res.status(404).send({
                msg: `no user found with id ${req.params.id}`
            });
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("get user failed - internal server error");
    }
});
userRouter.post("/", async (req, res) => {

    try {
        let db = await dbRtns.getDBInstance();
        let newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,

        }
        if (!newUser.firstName || !newUser.lastName || !newUser.role) {
            return res.status(405).send({
                msg: `server received empty or invalid user data`
            });
        }
        let dbresponse = await dbRtns.addOne(db, usersCollection, newUser);
        res.status(200).send({
            msg: `new user added to user collection`,
            id: dbresponse.insertedId
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send({msg: "add new user failed - internal server error"});
    }
});
userRouter.delete("/:id", async (req, res) => {
    try {
      let db = await dbRtns.getDBInstance();
      let o_id = new ObjectId(req.params.id);
      let queriedUser = await dbRtns.findOne(db, usersCollection, {
        _id: o_id,
      });
      if (queriedUser) {
        await dbRtns.deleteOne(db, usersCollection, { _id: o_id });
        res.status(200).send({
          msg: `user ${queriedUser.firstName} with id ${req.params.id} is deleted`,
        });
      } else {
        res.status(404).send({
          msg: `user with ${req.params.id} does not exist`,
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("delete project failed - internal server error");
    }
  });
module.exports = userRouter;