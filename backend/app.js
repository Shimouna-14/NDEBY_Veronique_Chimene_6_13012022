const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config();
const cors = require('cors');

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

mongoose.connect(process.env.DB_CO,
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"))

app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.HOST);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next()
});

app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;