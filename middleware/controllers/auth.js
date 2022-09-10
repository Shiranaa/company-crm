const jwt = require("jsonwebtoken");
const joi = require("joi");
const database = require("./database");
const bcrypt = require("bcrypt");

const JWT_SECRET = "shiranaa";

async function login(req, res, next) {
  const reqBody = req.body;

  const schema = joi.object({
    email: joi.string().required().min(6).max(255).email(),
    password: joi.string().required().min(6),
  });

  const { error, value } = schema.validate(reqBody);

  if (error) {
    console.log(error.details[0].message);
    res.status(401).send("Unauthorized");
    return;
  }

  const sql = "SELECT * FROM users WHERE email=?;";

  try {
    const result = await database.query(sql, [value.email]);
    const user = result[0][0];
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const validPassword = await bcrypt.compare(
      value.password,
      user.password_hash
    );
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const param = { email: value.email };
    const token = jwt.sign(param, JWT_SECRET, { expiresIn: "72800s" });

    res.json({
      token: token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(401).send(err.message);
    return;
  }
}

async function registerUser(req, res, next) {
  const schema = joi.object({
    username: joi.string().required().min(2).max(50),
    email: joi.string().required().email().min(6).max(255),
    password: joi.string().required().min(6).max(32),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error.details[0].message);
    res.status(400).send("error sign up new user");
    return;
  }

  const sql = `INSERT INTO users(username, email, password_hash) VALUES(?,?,?)`;

  try {
    const password_hash = await bcrypt.hash(value.password, 10);
    const result = await database.query(sql, [
      value.username,
      value.email,
      password_hash,
    ]);

    res.json({
      id: result[0].insertId,
      username: value.username,
      email: value.email,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send("error sign up new user");
  }
}

module.exports = { login, registerUser };
