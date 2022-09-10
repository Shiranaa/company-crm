const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const headers = require("./middleware/headers");
const authRouter = require("./routes/auth-router");
const customersRouter = require("./routes/customers-router");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(headers);
app.use(authRouter);
app.use("/customers", customersRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
