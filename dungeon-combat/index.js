// Importar librería Express.
const express = require("express")
// Importar librería Cors
const cors = require("cors")

// Crear una instancia del servplayer_idor Express.
const app = express()

const players = []

// Establecer la carpeta public como servidor para que puedan acceder 
// los clientes de la red.
app.use(express.static("public"))
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
        this.character = null
    }

    asign_character(character) {
        this.character = character
    }

    update_position(x, y) {
        this.x = x
        this.y = y
    }

    asign_attack(attack) {
        this.attack = attack
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

    console.log("\nNuevo id asignado: " + player_id)
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
    console.log("\nId. del jugador: " + player_id)
    console.log("Jugador elegido: " + players[player_index].character.type)

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
    res.send({ opponents })
})

// Envío al servidor del Id del jugador y el ataque elegido.
app.post("/character/:player_id/attacks", (req, res) => {
    const player_id = req.params.player_id || ""
    const player_attack = req.body.attack || 0

    const player_index = players.findIndex((player) =>
        player.player_id === player_id)

    if (player_index >= 0) {
        players[player_index].asign_attack(player_attack)
    }
    console.log("\nId. del jugador: " + player_id)
    console.log("Ataque  elegido: " + player_attack)

    // Termino de responder.
    res.end()
})

// Petición al servidor del ataque enemigo.
app.get("/character/:player_id/attacks", (req, res) => {
    const player_id = req.params.player_id || ""
    const player = players.find((player) => player.player_id === player_id)
    res.send({
        enemy_attack_selected: player.attack || 0
    })
    player.attack = 0
})

// Reiniciar el juego.
app.get("/character/:player_id/clear", (req, res) => {
    const player_id = req.params.player_id || ""
    const player_index = players.findIndex((player) =>
        player.player_id === player_id)
    
    // Borrar el jugador de la lista.
    players.splice(player_index, 1)

    // Crear el jugador nuevo con su mismo id.
    const player = new Player(player_id)
    players.push(player)

    res.send(player_id)
})

// Escuchar las peticiones de los clientes en el puerto 8080.
app.listen(8080, () => {
    console.log("Servidor funcionando")
})