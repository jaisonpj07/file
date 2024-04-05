const signIn = require("../Models/signIn");

const jwt = require("jsonwebtoken");

// Define your secret key for verifying the token
const secretKey = process.env.secret_key;
var token;
module.exports.userSignIn = async (req, res) => {
  try {
    const { userName, passWord } = req.body;
    const username = userName;
    const password = passWord;

    const payload = {
      username: username,
    };

    const options = {
      expiresIn: "1h",
    };
    const response = await signIn.signIn(username, password);
    if (response) {
      token = jwt.sign(payload, secretKey, options);
      return res.json({
        message: "login successfully",
        token: token,
      });
    } else {
      console.log("user not valid");
      return res.json({
        message: "authentication failed",
      });
    }
  } catch (error) {}
};

module.exports.token = token;
