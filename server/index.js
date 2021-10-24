const express = require("express");
const app = express();
require("dotenv").config();

//Connect to monk database
const mongoURI = `localhost/database`;
let db = require("monk")(process.env.MONGOATLAS_URL || mongoURI);
console.log("Connected to " + db._connectionURI);

//Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());
db.addMiddleware(require("monk-middleware-wrap-non-dollar-update"));

const bodyParser = require("body-parser");
app.use(bodyParser.json()); //support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //support encoded bodies

//ROUTES
app.use("/auth", require("./routes/jwtAuth"));

//create a lobby
app.post("/:lobby", (req, res) => {
  const lobby = req.params.lobby;
  db.get(lobby).then(res.json(`${lobby} created`));
});

//post user to lobby
app.post("/:lobby/user", (req, res) => {
  const name = req.body.name;
  const room = db.get(req.params.lobby);

  room
    .insert({ name: name, duration: 0, mp3: "" })
    .then((doc) => res.json(doc))
    .then(() => console.log(`${name} successfuly joined ${req.params.lobby}`))
    .catch((err) => console.log(err.message));
});

//get all users
app.get("/:lobby/users", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .find({})
    .then((users) => res.json(users))
    .catch((err) => console.log(err.message));
});

//conductor has begun recording
app.put("/:lobby/beginRecording", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { name: req.body.name },
      { $set: { recordingState: "in progress" } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log("hi" + err.message));
});

//get recording state (in progress or ended)
app.get("/:lobby/getRecordingState", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .find({})
    .then((users) => res.json(users[0].recordingState))
    .catch((err) => console.log(err.message));
});

//conductor has ended recording
app.put("/:lobby/endRecording", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { name: req.body.name },
      { $set: { recordingState: "ended" } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log("hi" + err.message));
});

//update users wave file
app.put("/:lobby/user/audio", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { name: req.body.name },
      { $set: { mp3: req.body.audioFile } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log("hi" + err.message));
});

//get users wave file
app.get("/:lobby/:user/getAudio", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .findOne({ name: `${req.params.user}` })
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
