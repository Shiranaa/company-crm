const jwt = require("jsonwebtoken");

const JWT_SECRET = "shiranaa";

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. go to /signin");
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Access denied. go to /signin");
  }
};
