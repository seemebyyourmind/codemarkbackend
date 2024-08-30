
const CodeRunning=require("./CodeRunning")
const AdminRouter=require("./AdminRouter")
const routes = (app) => {
  
  app.use("/api/code",CodeRunning)
  app.use("/admin",AdminRouter)
};

module.exports = routes;