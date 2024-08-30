const express = require("express");
const router = express.Router();

const { auth, submission } = require("../middlewares/index");
const controller = require("../controllers/submission/submission.controller");


router.post("/runandsubmit", submission.checkNullField, controller.runWithStoreData);
router.post("/runproblem", submission.checkNullField, controller.runWithoutStoreData);
router.post("/runcode",controller.runCode)

module.exports = router;