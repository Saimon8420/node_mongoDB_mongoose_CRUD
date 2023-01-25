require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const todoHandler = require("./routes/todoHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection with mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connection successful"))
    .catch(err => console.log(err));

// application routes
app.use("/todo", todoHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})