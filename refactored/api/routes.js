const routes = require('express').Router();
const path = require('path')

routes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"))
  });
  


module.exports = routes;