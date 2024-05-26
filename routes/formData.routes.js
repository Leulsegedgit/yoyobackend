module.exports = (app) => {
  const formData = require("../controllers/formData.controller.js");
  const router = require("express").Router();

  // Create a new FormData
  router.post("/", formData.create);

  // Get action by ref
  router.get("/action/:ref", formData.getActionByRef);

  // Update FormData by ref
  router.put("/:ref", formData.updateFormDataByRef);

  app.use("/api/formData", router);
};
