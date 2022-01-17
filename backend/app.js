const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");


mongoose.connect("mongodb+srv://Vero:!V3rrre)(@cluster.j1m8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"))

app.use((req, res, next) => {
    // Accéder à notre API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Origin", "*")
    // Headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
    // Requêtes avec les méthodes mentionnées 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next()
});

app.use(bodyParser.json());
app.use("/api/auth", userRoutes);

module.exports = app;