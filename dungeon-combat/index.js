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
}


class Character {
    constructor(name) {
        this.name = name
    }
}


// En una petición responder con un player_id.
app.get("/join", (req, res) => {
    const player_id = `${Math.random()}`
    const player = new Player(player_id)

    players.push(player)

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(player_id)
})

app.post("/character/:player_id", (req, res) => {
    const player_id = req.params.player_id || ""
    const player_name = req.body.player_name || ""
    const character = new Character(player_name)

    const player_index = players.findIndex((player) =>
        player.player_id === player_id)

    if (player_index >= 0) {
        players[player_index].asign_character(character)
    }

    console.log(players)
    console.log(player_id)
    console.log(players[0].character.name)
    // Termino de responder.
    res.end()
})

// Escuchar las peticiones de los clientes en el puerto 8080.
app.listen(8080, () => {
    console.log("Servidor funcionando")
})