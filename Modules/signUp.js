const signUpInsert = require("../Models/signUp");

module.exports.userSignUp = async (req, res) => {
  const { userName, passWord } = req.body;
  const username = userName;
  const password = passWord;

  try {
    if ((username === '') || (password === '')) {
      return res.json({
        message: "username or password required",
      });
    } else {
      const response = await signUpInsert.signUp(username, password);
      if (response) {
        return res.status(200).json({ message: "User created successfully" });
      } else {
        return res.status(400).json({ message: "User already exists" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
