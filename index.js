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

// response: {success: boolean}
// creates a lobby and responds whether or not it was a success
app.post("/:lobby", async (req, res) => {
  const lobby = req.params.lobby;

  try {
    let count = await db.get(lobby).count();
    if (count != 0) {
      res.json({success:false});
      return;
    }
  }
  catch {
    res.json({success: false});
  }

  db.get(lobby)
    .insert({recordingStatus: "not in progress"})
    .then(res.json({success: true}));
});

// response: {exists: boolean}
// returns whether or not the specified lobby code already exists
app.get("/:lobby", async (req, res) => {
  const lobby = req.params.lobby;
  try {
    let count = await db.get(lobby).count();
    res.json({exists: (count > 0)});
  }
  catch {
    res.json({exists: false});
  }
  });

  
// response: {exists: boolean}
// returns whether or not the specified user exists in the specified lobby
app.get("/:lobby/getUser", async (req, res) => {
  const room = db.get(req.params.lobby);
  const username = req.query.name;
  try {
    let user = await room.findOne({name: username});
    res.json({exists: (user != null)});
  }
  catch {
    res.json({exists: true});
  }
  });

// response: {success: boolean}
// add user to a lobby and return whether operation was successful
app.post("/:lobby/user", async (req, res) => {
  const name = req.body.name;
  const room = db.get(req.params.lobby);

  let success = false;
  let attempts = 2;
  while (attempts > 0 && !success) {
    attempts--;
    try {
      const count = await room.count();
      if (count == 0) {
        success = false;
        continue;
      }

      let doc = room.insert({ name: name, duration: 0, mp3: "" });
      success = (doc != null);
    }
     catch {
      success = false;
     }
  }

  res.json({success: success})
});

// response: {users}
// get a list of all users' names in the specified lobby
app.get("/:lobby/users", (req, res) => {
  const room = db.get(req.params.lobby);
  room
    .find({name:{$exists:true}})
    .then((users) => res.json(users))
    .catch((err) => {res.json({}); })
});

// updates that recording has started in a lobby 
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
    .catch((err) => {console.log(err.message); res.json(doc)});
});

// deletes the specified user from the lobby if they exist
app.delete("/:lobby/deleteUser", (req) => {
  console.log("tee");
  const room = db.get(req.params.lobby);
  const userName = req.body.name;
  room
    .remove({name:userName}, );
});


//get recording state (in progress or ended)
app.get("/:lobby/getRecordingState", (req, res) => {
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