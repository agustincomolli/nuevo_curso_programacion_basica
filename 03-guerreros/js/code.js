class Character {
    /* DESCRIPTION: Modela los personajes del juego, tanto del jugador
                    como los personajes enemigos.
    */

    constructor(id, name, image, health) {
        this.id = id
        this.name = name
        this.image = image
        this.health = health
        this.attacks_skills = []
        this.x = 20
        this.y = 30
        this.width = 80
        this.height = 80
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

const player = document.getElementById("spn-player").innerHTML
const player_image = document.getElementById("player-image")
const enemy = document.getElementById("spn-enemy").innerHTML
const enemy_image = document.getElementById("enemy-image")
const mapa = document.getElementById("map")

// Declarar variables de uso general.
let user_characters = []    // Contendrá los personajes a elegir.
let enemy_characters = []   // Contendrá los enemigos a elegir.
let player_attacks = []     // Secuencia de ataques del jugador.
let enemy_attacks = []      // Secuencia de ataques del enemigo.
let player_character = null
let enemy_character = null
let player_attack = 0
let enemy_attack = 0
let player_health = 3
let enemy_health = 3

// Declarar objetos que contendrán los personajes a elegir.
let knight = new Character("knight", "Caballero", "./images/knight.png", 3)
let archer = new Character("archer", "Arquero", "./images/archer.png", 3)
let mage = new Character("mage", "Mago", "./images/mage.png", 3)
let rogue = new Character("rogue", "Pícaro", "./images/rogue.png", 3)

// Declarar los objetos que contendrán los enemigos.
let skeleton_soldier = new Character("skeleton_soldier", "Esqueleto soldado",
    "./images/skeleton_soldier.png", 3)
let skeleton_archer = new Character("skeleton_archer", "Esqueleto arquero",
    "./images/skeleton_archer.png", 3)
let skeleton_mage = new Character("skeleton_mage", "Esqueleto mago",
    "./images/skeleton_mage.png", 3)
let orc = new Character("orc", "Orco", "./images/orc.png", 4)
let troll = new Character("troll", "Troll", "./images/troll.png", 5)

let canvas = map.getContext("2d")


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


function update_health_points() {
    /* 
        DESCRIPTION: Actualiza los puntos de vida de los combatientes.
    */
    spn_player_health.innerHTML = "❤️".repeat(player_health)
    spn_enemy_health.innerHTML = "💚".repeat(enemy_health)
}


function draw_player() {
    /* 
        DESCRIPTION: Actualiza los puntos de vida de los combatientes.
    */

    let player_selected = user_characters.find(character => character.name ===
        spn_player)
    canvas.drawImage(
        player_selected.image,
        player_selected.x,
        player_selected.y,
        player_selected.width,
        player_selected.height
    )
}

function select_enemy() {
    /* 
        DESCRIPTION: Selecciona un enemigo de forma aleatoria.
    */

    // Generar un número entre 1 y la cantidad de objetos en la lista enemy_characters
    // que representará a un enemigo a elegir.
    let enemy_number = get_random_number(0, enemy_characters.length - 1)
    let enemy_name = ""

    enemy_character = enemy_characters[enemy_number]

    enemy_name = enemy_character.name
    enemy_image.src = enemy_character.image
    enemy_image.alt = enemy_character.name
    enemy_health = enemy_character.health

    spn_enemy.innerHTML = enemy_name
    // Crear una lista con todos los ataques del enemigo.
    enemy_attacks = enemy_character.attacks_skills
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
            warrior_selected = character.name
        }
    })

    if (warrior_selected == "") {
        p_warning_message.style.display = "block"
        return // Salir de la función.
    }

    // Mostrar la imágen del personaje elegido buscando en la lista de
    // user_character el personaje que coincida con el elegido por el usuario.
    player_character = user_characters.find(character => character.name ===
        warrior_selected)
    player_image.src = player_character.image
    player_image.alt = player_character.name

    // Obtener la cantidad de vida del personaje elegido.
    player_health = player_character.health

    // Mostrar el jugador elegido.
    spn_player.innerHTML = player_character.name
    // Ocultar la sección de selección de jugador
    sec_player_selection.style.display = "none"
    // Mostrar la sección del mapa.
    // sec_view_map.style.display = "flex"

    // Mostrar las secciones de ataque y mensajes.
    sec_attack_selection.style.display = "flex"
    sec_combat.style.display = "grid"
    select_enemy()

    update_health_points()

    fill_with_skills()

    add_click_event()
}


function lets_combat(player, enemy) {
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

    if (player == enemy) {
        result = 0
    } else if (player == 1 && enemy == 3) {
        // 🪨 vs ✂️
        result = 1
        enemy_health -= 1 // Resto un punto de vida al enemigo.
    } else if (player == 2 && enemy == 1) {
        // 🧻 vs 🪨
        result = 1
        enemy_health -= 1 // Resto un punto de vida al enemigo.
    } else if (player == 3 && enemy == 2) {
        // ✂️ vs 🧻
        result = 1
        enemy_health -= 1 // Resto un punto de vida al enemigo.
    } else {
        result = 2
        player_health -= 1 // Resto un punto de vida al jugador.
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

    let selected_attack = attack_list.find(skill => skill.value === attack_number).description

    return selected_attack
}


function check_health() {
    /* 
        DESCRIPTION: Revisa si la vida de alguno de los contrincantes está
        en 0 lo que determinará quién ganó el juego.
    */

    if (enemy_health == 0) {
        p_result.innerHTML = "🥳 ¡Ganaste! 🏆"
        spn_enemy_health.innerHTML = "☠️"
    } else if (player_health == 0) {
        p_result.innerHTML = "😭 ¡Perdiste! 🥀"
        spn_player_health.innerHTML = "☠️"
    } else {
        return
    }

    // Cambiar el tamaño de la letra para indicar el mensaje final.
    p_result.style.fontSize = "x-large"
    p_result.style.marginBlock = "4px"


    // Deshabilitar botones de ataque.
    attack_buttons.forEach((button) => {
        button.disabled = true
    })
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


function move_player() {
    /* 
        DESCRIPTION: Mueve el jugador por el canvas.
    */


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
        player_card = `
        <input type="radio" name="${character.name}" id="rd-${character.id}">
        <label class="card" for="rd-${character.id}">
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
        </label>
        `
        div_cards.innerHTML += player_card
        // Crear un lista con todos los elementos radio button.
    })
}


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */

    // Inicializar los botones del juego.
    btn_select.addEventListener("click", select_warrior)
    btn_reset.addEventListener("click", reset_game)
    btn_move.addEventListener("click", move_player)

    // Inicializar las secciones del juego.
    p_warning_message.style.display = "none"
    sec_view_map.style.display = "none"
    sec_attack_selection_selection.style.display = "none"
    sec_combat.style.display = "none"
    div_messages.style.display = "none"
    btn_reset.style.display = "none"
    div_attack_messages.style.display = "none"

    fill_with_characters()
}


// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)

// Agregar habilidades de ataque a cada personaje.
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
    },
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

// Los enemigos tendrán las mismas skills que los personajes a elegir.
skeleton_soldier.attacks_skills = knight.attacks_skills
skeleton_archer.attacks_skills = archer.attacks_skills
skeleton_mage.attacks_skills = mage.attacks_skills

// Agregar todos los objetos character a la lista.
user_characters.push(knight, archer, mage, rogue)
// ... y todos los enemigos.
enemy_characters.push(skeleton_soldier, skeleton_archer, skeleton_mage)
