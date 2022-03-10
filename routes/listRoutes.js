const express = require('express');
const userRouter = express.Router();
// define a default route
userRouter.get('/', (req, res) => {
    res.status(200).send({
        msg: `this would be a response from the default route`
    });
});
// define a get route with a name parameter
userRouter.get('/:name', (req, res) => {
    let name = req.params.name;
    res.status(200).send({
        msg: `this would be a response using the ${name} parameter`
    });
});
module.exports = userRouter;