// Importar librería Express.
const express = require("express")

// Crear una instancia del servidor Express.
const app  = express()

// En una petición responder con un "Hola".
app.get("/", (req, res) => {
    res.send("Hola")
})

// Escuchar las peticiones de los clientes en el puerto 8080.
app.listen(8080, () => {
    console.log("Servidor funcionando")
})