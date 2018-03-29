const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
// instance of watson speech to text
const s2t = require("watson-developer-cloud/speech-to-text/v1");

// speech to text
const speechToText = new s2t({
  username: "073dffd9-45aa-47ae-a778-d8c612ccf935",
  password: "pe1op06yoTx7",
  headers: {
    "X-Watson-Learning-Opt-Out": "true",
    "x-global-transaction-id": "f257b1145ab982d89211b485"
  }
});

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));
const port = process.env.PORT || "3001";
/**
 * Get port from environment and store in Express.
 */
app.set("port", port);
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set the directory for the uploads to the uploaded to
var DIR = "./uploads/";

var storage = multer.diskStorage({
  // file storage path
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  //get filename
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
// para CORN
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

// POST: Post audio to server
app.post("/api/upload", upload.single("file"), (req, res) => {
  // get file content type
  const file = req.file.path;
  var params = {
    // From file
    audio: fs.createReadStream(file),
    timestamps: false,
    model: "en-US_BroadbandModel",
    content_type: req.file.mimetype + ";rate=16000",
    interim_results: false,
    word_confidence: false
  };
  // convert
  speechToText.recognize(params, function (err, data) {
    if (err) {
      res.status(500).json({
        status : err.code,
        message : err.code_description
      });
    } else {
      var finalResult = "";
      data.results.forEach(item => {
        finalResult = finalResult + item.alternatives[0].transcript;
      });
      res.status(200).json(finalResult);
    }

    // console.log("Data: ", JSON.stringify(data, null, 2));
  });
});

// start server
app.listen(port, () => {
  console.log("Listening on port %s...", port);
});
