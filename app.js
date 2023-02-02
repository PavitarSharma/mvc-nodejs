const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fileupload = require("./routes/file-upload");
const token = require("./routes/token");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const router = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const auth = require("./middleware/auth");
const PORT = 3000;
const app = express();

// mongodb connection
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost:27017/ecom", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database error ", error.message);
  });
// app.use(fileUpload({
//     createParentPath: true
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get("/", auth, async (req, res) => {
  res.json({
    success: true,
    message: "Server is listening",
  });
});

app.use("/upload", fileupload);
// app.use("/token", token)
app.use("/api", userRoutes);

app.use("/api", storeRoutes);

app.use("/api/category", categoryRoutes)

app.use("*", (req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
