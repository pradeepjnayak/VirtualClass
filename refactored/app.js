const app = require('express')();
const routes = require('./api/routes');
var bodyParser = require('body-parser');
var cors = require('cors');

//
app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//  Connect all our routes to our application
app.use('/', routes);


// Run the server.
app.listen(3000, () => {
    console.log("App listening at port 3000")
})