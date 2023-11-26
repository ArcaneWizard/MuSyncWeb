const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 5000;

//Connect to monk database
const mongoURI = `localhost/database`;
let db = require("monk")(process.env.MONGOATLAS_URL || mongoURI);
console.log("Connected to " + db._connectionURI);
console.log(db);

//Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "50mb" }, ));
db.addMiddleware(require("monk-middleware-wrap-non-dollar-update"));

//create a lobby
app.post("/:lobby", (req, res) => {
  console.log("a");
  const lobby = req.params.lobby;
  db.get(lobby)
    .insert({recordingStatus: "not in progress"})
    .then(res.json(`${lobby} created`));
});

//returns {exists: boolean}, depending on whether the specified lobby code already exists
app.get("/:lobby", (req, res) => {
  const lobby = req.params.lobby;
  try {
    if (db.get(lobby).count() == 1)
      res.json({lobbyExists: true});
    else
      res.json({lobbyExists: false});
  }
  catch {
    res.json({lobbyExists: true});
  }
  });

//post user to lobby. returns {boolean success}
app.post("/:lobby/user", (req, res) => {
  const name = req.body.name;
  const room = db.get(req.params.lobby);
  room.count().then(count => {
    if (count == 0) {
       res.json({success: false});
    }

    room
      .insert({ name: name, duration: 0, mp3: "" })
      .then(() => res.json({success: true}))
      .catch((err) => console.log(err.message))
  })
});

//get all users
app.get("/:lobby/users", (req, res) => {
  console.log("c");
  const room = db.get(req.params.lobby);
  room
    .find({})
    .then((users) => res.json(users))
    .catch((err) => {console.log(err.message); res.json({}); })
});

//conductor has begun recording
app.put("/:lobby/beginRecording", (req, res) => {
  console.log("d");
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { recordingStatus:{$exists: true} },
      { $set: { recordingStatus: "in progress" } },
      {}
    )
    .then((doc) => console.log(doc))
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

//get recording state (in progress or ended)
app.get("/:lobby/getRecordingState", (req, res) => {
  console.log("test");
  const room = db.get(req.params.lobby);
  room
    .findOne({recordingStatus: {$exists: true}})
    .then((info) => res.json(info.recordingStatus))
    .catch((err) => {res.json("not in progress")});
});

//conductor has ended recording
app.put("/:lobby/endRecording", (req, res) => {
  console.log("test2");
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { recordingStatus:{$exists: true} },
      { $set: { recordingStatus: "not in progress" } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

//update users wave file
app.put("/:lobby/user/audio", (req, res) => {
  console.log("tes3");
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { name: req.body.name },
      { $set: { mp3: req.body.audioFile } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

//get users wave file
app.get("/:lobby/:user/getAudio", (req, res) => {
  console.log("test4");
  const room = db.get(req.params.lobby);
  room
    .findOne({ name: `${req.params.user}` })
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

//share embedded link with users
app.put("/:lobby/embeddedLink", (req, res) => {
  console.log("test5");
  const room = db.get(req.params.lobby);
  room
    .findOneAndUpdate(
      { name: req.body.name },
      { $set: { embeddedLink: req.body.embeddedLink } },
      {}
    )
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err.message));
});

//get embedded link
app.get("/:lobby/embeddedLink", (req, res) => {
  console.log("test6");
  const room = db.get(req.params.lobby);
  room
    .find({})
    .then((users) => res.json(users[0].embeddedLink))
    .catch((err) => console.log(err.message));
});

//get all user info, including files
app.get("/:lobby/userInfo", (req, res) => {
  console.log("test7");
  const room = db.get(req.params.lobby);
  room
    .find({})
    .then((users) => res.json(users))
    .catch((err) => console.log(err.message));
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));
}

app.get("/*", (req, res) => {
  res.sendFile(path.join(path.join(__dirname, "./build/index.html")));
});