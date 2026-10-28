const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const bookRoute = require("./route");

const app = express();


app.use(express.json());

app.use("/api/books", bookRoute);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

