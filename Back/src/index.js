const express = require("express");
const session = require("express-session");
const app = express();
const {dbConnection} = require("./config/db");
const PORT = 3000;
const ProductosRoutes = require("./routes/productoRoutes");

app.use(
    session({
      secret:"a",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(express.static(__dirname + '/../public'));
app.use(express.urlencoded({ extended: true }));
dbConnection();
app.use(express.json());
app.use("/", ProductosRoutes);

app.listen(PORT, () => console.log("Servidor levantado en el puerto: " + PORT));