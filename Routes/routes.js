const express = require("express")
const router = express.Router();
const userRegister =  require("../Modules/signUp");
const userSignIn = require("../Modules/signIn");
const fileOperations = require("../Modules/file");
const verifyToken = require("../Middleware/tokenVerification")

router.post("/signup",userRegister.userSignUp);
router.post("/login",userSignIn.userSignIn);
router.post("/upload",verifyToken.verifyToken,fileOperations.fileUpload);
router.get("/list",verifyToken.verifyToken,fileOperations.getFile);
router.post("/extract",verifyToken.verifyToken,fileOperations.fileExtract);

module.exports = router;
