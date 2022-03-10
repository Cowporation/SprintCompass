const express = require('express');
const taskRouter = express.Router();
// define a default route
taskRouter.get('/', (req, res) => {
    res.status(200).send({
        msg: `this would be a response from the default route`
    });
});
// define a get route with a name parameter
taskRouter.get('/:name', (req, res) => {
    let name = req.params.name;
    res.status(200).send({
        msg: `this would be a response using the ${name} parameter`
    });
});
module.exports = taskRouter;