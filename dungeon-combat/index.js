// Importar librería Express.
const express = require("express")
// Crear una instancia del servidor Express.
const app = express()

class Player {
    /* 
        DESCRIPTION: Modela a un jugador
    */

    constructor(id) {
        this.id = id
    }
}


const players = []

// En una petición responder con un "Hola".
app.get("/join", (req, res) => {
    const id = `${Math.random()}`
    const player = new Player(id)

    players.push(player)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id)
})

// Escuchar las peticiones de los clientes en el puerto 8080.
app.listen(8080, () => {
    console.log("Servidor funcionando")
})