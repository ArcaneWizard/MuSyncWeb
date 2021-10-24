const router = require("express").Router();
const pool = require("../db");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
