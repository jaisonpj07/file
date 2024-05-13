const express = require("express")
const router = express.Router();
const fileOperations = require("../Modules/file");

router.post("/upload",fileOperations.fileUpload);

module.exports = router;
