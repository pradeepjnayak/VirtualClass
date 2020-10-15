module.exports = (app) => {
  const users = require("../controllers/user.controller");

  // Create a new User
  app.post("/users", users.create);

  // Validate user login
  app.post("/users/signin", users.signIn);

  // Retrieve all Users
  app.get("/users", users.findAll);

  // Retrieve a single User with UserId
  app.get("/users/:UserId", users.findOne);

  // Update a User with UserId
  app.put("/users/:UserId", users.update);

  // Delete a User with UserId
  app.delete("/users/:UserId", users.delete);

};
