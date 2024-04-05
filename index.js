const express = require("express");
const app = express();
const port = 3000;
const route = require("./Routes/routes");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", route);

app.listen(port, () => {
  console.log("server running on port", port);
});
