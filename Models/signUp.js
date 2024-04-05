const { client } = require("../Models/dbConnect");
const db = client.db("file_app");
const collection = db.collection("users");

module.exports.signUp = async (username, password) => {
  try {
    const userName = username;
    const passWord = password;
    await client.connect();
    // Search for the document
    const existingData = await collection.findOne({ username: userName });
    if (existingData === null) {
      console.log("Data doesn't exist");
      // Insert the new user
      await collection.insertOne({
        username: userName,
        password: passWord,
        createdAt: new Date(),
      });
      return true;
    } else {
      console.log("Data already exists");
      return false;
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
