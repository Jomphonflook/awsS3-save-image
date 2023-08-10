const express = require("express");
const multer = require("multer");
const fs = require('fs');
const upload = multer({ dest: "uploads/" });
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile, getFileStream } = require("./s3");
const app = express();
const port = 3000; // You can change the port if needed

// Define a route to handle GET requests
app.get("/", (req, res) => {
  res.send("Hello, this is your Node.js API!");
});

app.get("/getImage", (req,res)=>{
    console.log(req.query)
    const key = req.query.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
})

app.post("/profile", upload.single("avatar"), async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path); //not save file to folder uploads
  console.log(result);
  res.send({ key: `${result.Key}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
