// Importar librería Express.
const express = require("express")
// Importar librería Cors
const cors = require("cors")

// Crear una instancia del servplayer_idor Express.
const app = express()

const players = []

// Usar librería cors.
app.use(cors())
// Usar las opciones de express para JSON.
app.use(express.json())

class Player {
    /* 
        DESCRIPTION: Modela a un jugador
    */

    constructor(player_id) {
        this.player_id = player_id
    }

    asign_character(character) {
        this.character = character
    }

    update_position(x, y) {
        this.x = x
        this.y = y
    }
}


class Character {
    constructor(type) {
        this.type = type
    }
}


// Petición al servidor para entregar un id único por jugador.
app.get("/join", (req, res) => {
    const player_id = `${Math.random()}`
    const player = new Player(player_id)

    players.push(player)

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(player_id)
})

// Envío al servidor del Id del jugador y de su nombre.
app.post("/character/:player_id", (req, res) => {
    const player_id = req.params.player_id || ""
    const player_type = req.body.player_type || ""
    const character_type = new Character(player_type)

    const player_index = players.findIndex((player) =>
        player.player_id === player_id)

    if (player_index >= 0) {
        players[player_index].asign_character(character_type)
    }

    // Termino de responder.
    res.end()
})

// Envío al servidor de las coordenadas del jugador.
app.post("/character/:player_id/position", (req, res) => {
    const player_id = req.params.player_id || ""
    const player_x = req.body.player_x || 0
    const player_y = req.body.player_y || 0

    const player_index = players.findIndex((player) =>
        player.player_id === player_id)

    if (player_index >= 0) {
        players[player_index].update_position(player_x, player_y)
    }

    // Crear una lista con los jugadores menos el que envió la solicitud.
    const opponents = players.filter((player) => player.player_id != player_id)
    // Devolver la lista de oponentes.
    res.send({opponents})
})

// Escuchar las peticiones de los clientes en el puerto 8080.
app.listen(8080, () => {
    console.log("Servidor funcionando")
})