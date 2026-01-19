const indexR = require("./index");
const usersR = require("./users");
const drinksR = require("./drinks");




exports.configRoutes = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/drinks",drinksR);


}