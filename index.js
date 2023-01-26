require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const todoHandler = require("./routes/todoHandler");
const userHandler = require("./routes/userHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection with mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connection successful"))
    .catch(err => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})