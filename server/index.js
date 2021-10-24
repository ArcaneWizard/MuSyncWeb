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

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE id = $2",
      [description, id]
    );
    res.json("yeet");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);
  res.json("todo " + id + " was deleted.");
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
