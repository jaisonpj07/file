const { client } = require("../Models/dbConnect");
const db = client.db("file_app");
const collection = db.collection("users");

module.exports.signIn = async (username, password) => {
  try {
    const userName = username;
    const passWord = password;
    await client.connect();
    // Search for the document that matches your criteria
    const existingData = await collection.findOne({
      username: userName,
      password: passWord,
    });

    if (existingData === null) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
