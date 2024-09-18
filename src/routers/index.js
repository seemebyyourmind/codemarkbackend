
const CodeRunning=require("./CodeRunning")
const AdminRouter=require("./AdminRouter")
const UserRouter=require("./UserRouter")
const routes = (app) => {
  
  app.use("/api/code",CodeRunning);
  app.use("/admin",AdminRouter);
  app.use("/user",UserRouter);

};

module.exports = routes;