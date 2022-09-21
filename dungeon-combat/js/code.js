class Character {
    /* DESCRIPTION: Modela los personajes del juego, tanto del jugador
                    como los personajes enemigos.
    */

    constructor(type, name, image, health, x = 295, y = 400, id = null) {
        this.id = id
        this.type = type
        this.name = name
        this.image = image
        this.health = health
        this.attacks_skills = []
        this.x = x
        this.y = y
        this.width = 60
        this.height = 60
        this.img_in_map = new Image()
        this.img_in_map.src = this.image
        this.speed_x = 0
        this.speed_y = 0
    }


    draw_character(canvas) {
        /* 
            DESCRIPTION: Dibuja el objeto en el canvas.
            PARAMETERS:
                        canvas = es el lienzo donde se va a dibujar.
        */
        canvas.drawImage(
            this.img_in_map,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}


// Declarar todos los elementos HTML que voy a usar como constantes.
const btn_select = document.getElementById("btn-select")
const btn_reset = document.getElementById("btn-reset")
const btn_move = document.getElementById("btn-move")

const div_attack_buttons = document.getElementById("div-attack-buttons")
const div_cards = document.getElementById("div-cards")
const div_messages = document.getElementById("div-messages")
const div_attack_messages = document.getElementById
    ("div-attack-messages")
const div_player_attack = document.getElementById("div-player-attack")
const div_enemy_attack = document.getElementById("div-enemy-attack")

const sec_attack_selection_selection = document.getElementById
    ("sec-attack-selection")
const sec_combat = document.getElementById("sec-combat")
const sec_player_selection = document.getElementById("sec-player-selection")
const sec_attack_selection = document.getElementById("sec-attack-selection")
const sec_view_map = document.getElementById("sec-view-map")

const p_result = document.getElementById("p-result")
const p_warning_message = document.getElementById("p-warning-message")

const spn_player_health = document.getElementById("spn-player_health")
const spn_enemy_health = document.getElementById("spn-enemy_health")
const spn_player = document.getElementById("spn-player")
const spn_enemy = document.getElementById("spn-enemy")

const img_player = document.getElementById("img-player")
const img_enemy = document.getElementById("img-enemy")
const can_map = document.getElementById("can-map")

// Declarar variables de uso general.
let user_characters = []    // Tendrá los personajes a elegir.
let enemy_characters = []   // Tendrá los enemigos a elegir.
let player_id = null // Tendrá el id enviado desde el backend
let player_character = null
let enemy_character = null
let player_attack = 0
let enemy_attack = 0

// Declarar objetos que contendrán los personajes a elegir.
let knight = null
let archer = null
let mage = null
let rogue = null

// Declarar los objetos que contendrán los enemigos.
let skeleton_soldier = null
let skeleton_archer = null
let skeleton_mage = null

let game_map = can_map.getContext("2d")
let map_background = new Image()
let interval = null


function get_random_number(min, max) {
    /* 
        DESCRIPTION: Genera un número aleatorio entre el min y el max.
        PARAMETERS:
                    min = valor mínimo
                    max = valor máximo
    */
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function randomize_list(list = []) {
    /* 
        DESCRIPTION: Devuelve una lista ordenada de forma aleatoria.
    */

    let temp_list = []
    let temp_idx = 0

    while (list.length > 0) {
        // Obtener de forma aleatoria un número de índice entre el 1° y 
        // último valor de la lista principal.
        temp_idx = get_random_number(0, list.length - 1)
        // Agregarel item a la lista temporal.
        temp_list.push(list[temp_idx])
        // Borrar el item de la lista principal.
        list.splice(temp_idx, 1)
    }

    return temp_list
}


function fill_with_skills() {
    /* 
        DESCRIPTION: Crear los botones que se usarán para realizar ataques.
        PARAMETERS: character_name: el nombre del personaje elegido.
    */

    let skill_button = ""
    // Extraer la lista de ataques del personaje character_name.
    let skill_list = player_character.attacks_skills

    // Por cada elemento del diccionario skill_list...
    skill_list.forEach((skill) => {
        // Crear un botón en HTML con el ataque.
        skill_button = `
        <button id="btn-${skill.id}" class="attack-button" 
        title="${skill.description}">
        <img src='${skill.image}'/>
        </button>
        `
        div_attack_buttons.innerHTML += skill_button
    })
}


function update_health_points() {
    /* 
        DESCRIPTION: Actualiza los puntos de vida de los combatientes.
    */
    spn_player_health.innerHTML = "❤️".repeat(player_character.health)
    spn_enemy_health.innerHTML = "💚".repeat(enemy_character.health)
}

function show_combat_section() {
    /* 
        DESCRIPTION: Muestra la sección de combate con la info de los oponentes.
    */

    // Mostrar información del enemigo.
    img_enemy.src = enemy_character.image
    img_enemy.alt = enemy_character.name
    spn_enemy.innerHTML = enemy_character.name

    // Ocultar sección de mapa.
    sec_view_map.style.display = "none"
    // Detener el intervalo de refresco.
    clearInterval(interval)
    // Quitar los EventListeners del mapa para evitar bugs.
    document.removeEventListener("keydown", check_key_pressed)
    document.removeEventListener("keyup", stop_moving)


    // Mostrar las secciones de ataque y mensajes.
    sec_attack_selection.style.display = "flex"
    sec_combat.style.display = "grid"

    update_health_points()

    fill_with_skills()

    add_click_event()

}


function disable_buttons() {
    /* 
       DESCRIPTION: Deshabilita los botones de ataque.
   */

    let attack_buttons = []
    // Crear una lista con todos los botones de ataque creados.
    attack_buttons = document.querySelectorAll(".attack-button")

    attack_buttons.forEach((button) => {
        button.disabled = true
    })
}


function add_click_event() {
    /* 
       DESCRIPTION: Agrega el eventListener "click" a los botones creados.
   */

    let attack_buttons = []
    // Crear una lista con todos los botones de ataque creados.
    attack_buttons = document.querySelectorAll(".attack-button")

    attack_buttons.forEach((button) => {
        button.addEventListener("click", attack)
    })
}


function detect_colision(player, enemy) {
    /* 
        DESCRIPTION: Detecta si dos objetos se tocan.
    */

    const up_player = player.y + 25
    const left_player = player.x + 25
    const right_player = player.x + player.width - 25
    const down_player = player.y + player.height - 25

    const up_enemy = enemy.y
    const left_enemy = enemy.x
    const right_enemy = enemy.x + enemy.width
    const down_enemy = enemy.y + enemy.height

    if (
        down_player < up_enemy ||
        up_player > down_enemy ||
        right_player < left_enemy ||
        left_player > right_enemy
    ) {
        return
    }

    stop_moving()
    enemy_character = enemy

    show_combat_section()
}


function create_opponents_online(opponent) {
    /* 
        DESCRIPTION: Crear los objetos de jugadores online.
        PARAMETERS: opponent = es el objeto traído del backend que contiene
                    a un oponente en el juego
    */

    // Busca si el oponente ya existe en la lista de enemigos...
    let opponent_online = enemy_characters.find((character) =>
        character.id === opponent.player_id)

    //Si el oponente existe no volver a crearlo.
    if (opponent_online == undefined) {
        // Buscar en la lista de personajes, cual es el del oponente elegido.
        let player_template = user_characters.find((character) =>
            character.type === opponent.character.type)

        opponent_online = new Character(
            player_template.type,
            player_template.name,
            `./images/${player_template.type}_enemy.png`,
            player_template.health,
            opponent.x,
            opponent.y,
            opponent.player_id,
        )
        opponent_online.attacks_skills = player_template.attacks_skills
        enemy_characters.push(opponent_online)

        console.log("Nuevo oponente agregado: " + opponent_online.type)
    } else {
        // Actualizar posición del enemigo.
        opponent_online.x = opponent.x
        opponent_online.y = opponent.y
    }
    opponent_online.draw_character(game_map)
}


function send_position(player_x, player_y) {
    /* 
        DESCRIPTION: Envía al servidor la posición del jugador.
        PARAMETERS: player_x, player_y = integers que son las coordenadas
                    de X y de Y del personaje elegido.
    */

    fetch(`http://localhost:8080/character/${player_id}/position`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            player_x,
            player_y
        })
    })
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ opponents }) {
                        opponents.forEach((opponent) => {
                            if (opponent.character == null) return
                            create_opponents_online(opponent)
                        })
                    })
            }
        })
}


function is_in_border() {
    /* 
        DESCRIPTION: Detectar colisión del personaje con los bordes del canvas.
    */

    if (player_character.y + player_character.speed_y < 0) {
        return true
    }
    if (player_character.y + player_character.speed_y > can_map.height -
        player_character.height) {
        return true
    }
    if (player_character.x + player_character.speed_x < 0) {
        return true
    }
    if (player_character.x + player_character.speed_x > can_map.width -
        player_character.width) {
        return true
    }
}


function draw_canvas() {
    /* 
        DESCRIPTION: Dibuja al personaje seleccionado en el mapa.
    */

    if (is_in_border()) {
        return
    }

    player_character.x += player_character.speed_x
    player_character.y += player_character.speed_y

    game_map.clearRect(0, 0, can_map.width, can_map.height)

    // Dibujar el mapa.
    game_map.drawImage(
        map_background,
        0,
        0,
        can_map.width,
        can_map.height
    )

    // Dibujar el personaje elegido.
    player_character.draw_character(game_map)
    send_position(player_character.x, player_character.y)

    // Dibujar a los enemigos.
    enemy_characters.forEach(enemy => {
        enemy.draw_character(game_map)
        // Detectar si se produce una colisión.
        if (player_character.speed_x !== 0 || player_character.speed_y !== 0) {
            detect_colision(player_character, enemy)
        }
    })

}


function stop_moving() {
    /* 
        DESCRIPTION: Establece la velocidad sobre el eje Y y X en 0 para dejar de moverse.
    */

    player_character.speed_x = 0
    player_character.speed_y = 0
}


function move_up() {
    /* 
        DESCRIPTION: Establece la velocidad sobre el eje Y.
    */

    player_character.speed_y = -5
}


function move_right() {
    /* 
        DESCRIPTION: Establece la velocidad sobre el eje X.
    */

    player_character.speed_x = 5
}


function move_down() {
    /* 
        DESCRIPTION: Establece la velocidad sobre el eje Y.
    */

    player_character.speed_y = 5
}


function move_left() {
    /* 
        DESCRIPTION: Establece la velocidad sobre el eje X.
    */

    player_character.speed_x = -5
}


function check_key_pressed(event) {
    /* 
        DESCRIPTION: Mueve el jugador por el mapa.
    */

    if (event.key == "ArrowUp") {
        move_up()
    } else if (event.key == "ArrowRight") {
        move_right()
    } else if (event.key == "ArrowDown") {
        move_down()
    } else if (event.key == "ArrowLeft") {
        move_left()
    }
}


function initialize_map() {
    /* 
       DESCRIPTION: Agrega los eventListener para mover al personaje 
                    por el mapa.
   */

    interval = setInterval(draw_canvas, 50)

    can_map.width = 613
    can_map.height = 460
    map_background.src = "./images/map.png"
    // Agregar manejador de eventos para el mapa.
    document.addEventListener("keydown", check_key_pressed)
    document.addEventListener("keyup", stop_moving)
}


function send_player_to_backend() {
    /* 
        DESCRIPTION: Envía el nombre del jugador al backend.
    */

    fetch(`http://localhost:8080/character/${player_character.id}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            player_type: player_character.type
        })
    })
}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */

    let warrior_selected = ""
    // Crear una lista con todos los inputs.
    let rd_character_list = document.querySelectorAll("input[type='radio']")

    // Recorrer la lista para ver cuál está seleccionado.
    rd_character_list.forEach((character) => {
        if (character.checked) {
            warrior_selected = character.id.slice(3)
            return
        }
    })

    if (warrior_selected == "") {
        p_warning_message.style.display = "block"
        return // Salir de la función.
    }

    // Obtener el objeto del personaje elegido.
    player_character = user_characters.find(character => character.type ===
        warrior_selected)

    player_character.id = player_id

    // Mostrar la imágen del personaje elegido.
    img_player.src = player_character.image
    img_player.alt = player_character.name

    // Mostrar el jugador elegido.
    spn_player.innerHTML = player_character.name
    // Ocultar la sección de selección de jugador
    sec_player_selection.style.display = "none"
    // Mostrar la sección del mapa.
    sec_view_map.style.display = "flex"

    initialize_map()
    send_player_to_backend()

}


function lets_combat(player_attack, enemy_attack) {
    /* 
        DESCRIPTION: Devuelve un entero con el resultado del juego.
                     Si es 0 es empate, si es 1 gana player y si
                     es 2 gana enemy.
        PARAMETERS:
                    player = identifica el ataque del jugador.
                    enemy = identifica el ataque del enemigo.
                    1 = tierra, 2 = agua y 3 = fuego
    */
    let result = 0

    if (player_attack == enemy_attack) {
        result = 0
    } else if (player_attack == 1 && enemy_attack == 3) {
        // 🪨 vs ✂️
        result = 1
        enemy_character.health -= 1 // Resto un punto de vida al enemigo.
    } else if (player_attack == 2 && enemy_attack == 1) {
        // 🧻 vs 🪨
        result = 1
        enemy_character.health -= 1 // Resto un punto de vida al enemigo.
    } else if (player_attack == 3 && enemy_attack == 2) {
        // ✂️ vs 🧻
        result = 1
        enemy_character.health -= 1 // Resto un punto de vida al enemigo.
    } else {
        result = 2
        player_character.health -= 1 // Resto un punto de vida al jugador.
    }

    return result
}

function translate_result(match_result) {
    /* 
        DESCRIPTION: Devuelve un texto con el resultado del combate.
        PARAMETERS:  match_result = número que indica el resultado.
                     0 = empate, 1 = victoria, 2 = derrota
    */

    if (match_result == 1) {
        return "¡Ganaste! 😎"
    } else if (match_result == 2) {
        return "¡Perdiste! 😢"
    } else {
        return "¡Empate! 😐"
    }

}


function translate_attack(attack_number, attack_list) {
    /* 
        DESCRIPTION: Devuelve el nombre del ataque según se su número.
    */

    let selected_attack = attack_list.find(
        skill => skill.value === attack_number
    ).description

    return selected_attack
}


function check_health() {
    /* 
        DESCRIPTION: Revisa si la vida de alguno de los contrincantes está
        en 0 lo que determinará quién ganó el juego.
    */

    if (enemy_character.health == 0) {
        p_result.innerHTML = "🥳 ¡Ganaste! 🏆"
        spn_enemy_health.innerHTML = "👻"
        img_enemy.src = "./images/tomb.png"
        // Voltear imagen horizontalmente.
        img_enemy.style.transform = "scaleX(-1)"
    } else if (player_character.health == 0) {
        p_result.innerHTML = "😭 ¡Perdiste! 🥀"
        spn_player_health.innerHTML = "👻"
        img_player.src = "./images/tomb.png"
    } else {
        return
    }

    // Cambiar el tamaño de la letra para indicar el mensaje final.
    p_result.style.fontSize = "x-large"
    p_result.style.marginBlock = "4px"


    // Deshabilitar botones de ataque.
    disable_buttons()

    // Mostrar el botón reiniciar.
    btn_reset.style.display = "block"
}


function show_status(match_result) {
    /* 
        DESCRIPTION: Muestra mensajes de estado del juego.
    */

    let player_message = document.createElement("p")
    let enemy_message = document.createElement("p")
    let text_player_attack = translate_attack(player_attack,
        player_character.attacks_skills)
    let text_enemy_attack = translate_attack(enemy_attack,
        enemy_character.attacks_skills)
    let text_match_result = translate_result(match_result)

    update_health_points()

    // Actualizar mensaje de estado.
    p_result.innerHTML = text_match_result
    player_message.innerHTML = text_player_attack
    div_player_attack.appendChild(player_message)
    enemy_message.innerHTML = text_enemy_attack
    div_enemy_attack.appendChild(enemy_message)

    check_health()
}


function attack(event) {
    /* 
        DESCRIPTION: Selecciona el ataque del jugador según el botón 
                     presionado indicado por el parámetro 
                     "event.target.id".
                     Genera un ataque aleatorio del enemigo y muestra el
                     resultado.
    */

    let match_result = 0
    // Buscar em la lista de skills del personaje cuál es el valor del ataque.
    let attack_id = event.currentTarget.id.slice(4)
    player_attack = player_character.attacks_skills.find(
        skill => skill.id === attack_id).value

    if (div_messages.style.display == "none") {
        div_messages.style.display = "flex"
        div_attack_messages.style.display = "grid"
    }

    // Generar un número entre 1 y 3 que representará el ataque enemigo:
    enemy_attack = get_random_number(1, 3)

    match_result = lets_combat(player_attack, enemy_attack)

    // Mostrar mensajes de estado.
    show_status(match_result)
}


function reset_game() {
    /* 
        DESCRIPTION: Reinicia todas las opciones para jugar otra vez.
    */

    // window.location.reload() recarga la página devolviendo el html 
    // original.
    location.reload()
}


function fill_with_characters() {
    /* 
        DESCRIPTION: Llena la página HTML con los personajes elegibles
                     por el jugador.
    */

    let player_card = "" // Contiene el HTML de un personaje elegible.

    // Por cada personaje crear una tarjeta con sus valores.
    user_characters.forEach((character) => {
        // Crear un template literario usando las comillas invertidas `` que
        // tendrá los elementos que forman al personaje a elegir.
        // Todos los input radio tienen que tener el mismo nombre para que
        // cuando se seleccione uno, los otros se deseleccionen.
        player_card = `
        <input type="radio" name="character" id="rd-${character.type}">
        <label class="card" for="rd-${character.type}">
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
        </label>
        `
        div_cards.innerHTML += player_card
        // Crear un lista con todos los elementos radio button.
    })
}


function add_player_skills() {
    /* 
        DESCRIPTION: Agregar habilidades de ataque a cada personaje.
    */

    knight.attacks_skills.push(
        {
            id: "power_strike",
            image: "./images/power_strike.png",
            value: 1,
            description: "Golpe de poder" //🍃
        },
        {
            id: "retaliation",
            image: "./images/retaliation.png",
            value: 2,
            description: "Represalias"//💧
        },
        {
            id: "sword_storm",
            image: "./images/sword_storm.png",
            value: 3,
            description: "Tormenta de espadas" // 🔥
        }
    )

    archer.attacks_skills.push(
        {
            id: "simple-shot",
            image: "./images/simple-shot.png",
            value: 1,
            description: "Tiro simple" //🍃
        },
        {
            id: "headshot",
            image: "./images/headshot.png",
            value: 2,
            description: "Tiro en la cabeza"//💧
        },
        {
            id: "fire_arrow",
            image: "./images/fire_arrow.png",
            value: 3,
            description: "Flecha de fuego" // 🔥
        },
    )

    mage.attacks_skills.push(
        {
            id: "lightning_bolts",
            image: "./images/lightning_bolts.png",
            value: 1,
            description: "Relámpagos" //🍃
        },
        {
            id: "tsunami",
            image: "./images/tsunami.png",
            value: 2,
            description: "Tsunami"//💧
        },
        {
            id: "fireball",
            image: "./images/fireball.png",
            value: 3,
            description: "Bola de fuego" // 🔥
        },
    )

    rogue.attacks_skills.push(
        {
            id: "power_strike",
            image: "./images/power_strike.png",
            value: 1,
            description: "Golpe de poder" //🍃
        },
        {
            id: "confusion",
            image: "./images/confusion.png",
            value: 2,
            description: "Confusión"//💧
        },
        {
            id: "poison",
            image: "./images/poison.png",
            value: 3,
            description: "Envenenar" // 🔥
        },
    )
}


function add_enemy_skills() {
    /* 
        DESCRIPTION: Agregar habilidades de ataque a cada personaje.
                     Los enemigos tendrán las mismas skills que los 
                     personajes a elegir.
    */

    skeleton_soldier.attacks_skills = knight.attacks_skills
    skeleton_archer.attacks_skills = archer.attacks_skills
    skeleton_mage.attacks_skills = mage.attacks_skills
}


function create_characters() {
    /* 
        DESCRIPTION: Crea los personajes del juego, tanto jugadores como
                     oponentes.
    */

    let x = get_random_number(0, can_map.width - 60) // 60 es el ancho del personaje.
    let y = get_random_number(0, can_map.height - 60)

    // Crear objetos que contendrán los personajes a elegir.
    knight = new Character("knight", "Caballero", "./images/knight.png", 3, x, y)
    archer = new Character("archer", "Arquero", "./images/archer.png", 3, x, y)
    mage = new Character("mage", "Mago", "./images/mage.png", 3, x, y)
    rogue = new Character("rogue", "Pícaro", "./images/rogue.png", 3, x, y)

    // Crear los objetos que contendrán los enemigos.
    skeleton_soldier = new Character("skeleton_soldier", "Esqueleto Ssoldado",
        "./images/skeleton_soldier.png", 3, 475, 165)
    skeleton_archer = new Character("skeleton_archer", "Esqueleto Arquero",
        "./images/skeleton_archer.png", 3, 110, 195)
    skeleton_mage = new Character("skeleton_mage", "Esqueleto Mago",
        "./images/skeleton_mage.png", 3, 280, 85)

    add_player_skills()
    add_enemy_skills()

    // Agregar todos los objetos character a la lista.
    user_characters.push(knight, archer, mage, rogue)
    // ... y todos los enemigos.
    //enemy_characters.push(skeleton_soldier, skeleton_archer, skeleton_mage)
}


function join_the_game() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */

    // fetch hace un GET (una petición para obtener algo)
    fetch("http://localhost:8080/join")
        // El servidor se tomará un tiempo en responder.
        // Para eso utilizaremos el .then(func) pasándole 
        // la respuesta del servidor como parámetro.
        .then(function (response) {
            if (response.ok) {
                response.text()
                    .then(function (new_id) {
                        console.log("Id. asignado: " + new_id)
                        player_id = new_id
                    })
            }
        })
}


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */

    // Agregar manejadores de eventos en los botones del juego.
    btn_select.addEventListener("click", select_warrior)
    btn_reset.addEventListener("click", reset_game)

    // Inicializar las secciones del juego.
    p_warning_message.style.display = "none"
    sec_view_map.style.display = "none"
    sec_attack_selection_selection.style.display = "none"
    sec_combat.style.display = "none"
    div_messages.style.display = "none"
    btn_reset.style.display = "none"
    div_attack_messages.style.display = "none"

    create_characters()
    fill_with_characters()
    join_the_game()
}


// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)

