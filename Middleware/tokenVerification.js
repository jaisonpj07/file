const token = require("../Modules/signIn");
const jwt = require("jsonwebtoken");

const secretKey = process.env.secret_key;

module.exports.verifyToken = async (req, res, next) => {
  try {
    // Verify the token
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      jwt.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("Token has expired");
            return res.json({
              message: "token expired",
            });
          } else {
            console.error("Token verification failed:", err);
            return res.json({
              message: "token verification failed",
            });
          }
        } else {
          console.log("Token verified successfully");
          req.user = decoded;
          next();
        }
      });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.sendStatus(500);
  }
};
