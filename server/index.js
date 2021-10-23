const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const pool = require("./db");

const mongoURI = `localhost/database`;
let db = require("monk")(process.env.MONGOATLAS_URL || mongoURI);
console.log("Connected to " + db._connectionURI);

//middleware
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/auth", require("./routes/jwtAuth"));

//send entry in test collection
const joe = "ASYNC";
const room = db.get(joe);
room
  .insert([{ name: "Rusheel", age: 18, email: "rusheel@pigeon.com" }])
  .then((docs) => {})
  .catch((err) => console.log(err));

//create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY id");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
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
