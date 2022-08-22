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
    }
}


function aleatorio(min, max) {
    /* 
        DESCRIPTION: Genera un número aleatorio entre el min y el max.
        PARAMETERS:
                    min = valor mínimo
                    max = valor máximo
    */
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function update_health_points() {
    /* 
        DESCRIPTION: Actualiza los puntos de vida de los combatientes.
    */
    spn_player_health.innerHTML = "❤️".repeat(player_health)
    spn_enemy_health.innerHTML = "💚".repeat(enemy_health)
}


function select_enemy() {
    /* 
        DESCRIPTION: Selecciona un enemigo de forma aleatoria.
    */

    // Generar un número entre 1 y la cantidad de objetos en la lista enemy_characters
    // que representará a un enemigo a elegir.
    let enemy_number = aleatorio(0, enemy_characters.length - 1)
    let enemy_name = ""

    enemy_name = enemy_characters[enemy_number].name
    enemy_image.src = enemy_characters[enemy_number].image
    enemy_image.alt = enemy_characters[enemy_number].name
    enemy_health = enemy_characters[enemy_number].health

    spn_enemy.innerHTML = enemy_name
}

function fill_with_skills(character_name) {
    /* 
        DESCRIPTION: Crear los botones que se usarán para realizar ataques.
        PARAMETERS: character_name: el nombre del personaje elegido.
    */

    let skill_button = ""
    // Extraer la lista de ataques del personaje character_name.
    let skill_list = user_characters.find(character => character.name ===
        character_name).attacks_skills

    // Por cada elemento del diccionario skill_list...
    skill_list.forEach((skill) => {
        // Crear un botón en HTML con el ataque.
        skill_button = `
        <button id="${skill.id}" class="attack-button" 
        title="${skill.description}">${skill.name}</button>
        `
        div_attack_buttons.innerHTML += skill_button
    })

    // Crear una lista con todos los botones de ataque creados.
    attack_buttons = document.querySelectorAll(".attack-button")
}


function create_attack_sequence() {
    /* 
       DESCRIPTION: Crear la secuencia de ataques del jugador según los
                    botones pulsados.
   */

    attack_buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            player_attacks.push(e.target.id.slice(4))
            button.style = "background:  #c3baa2;"
        })
    })
}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */

    let warrior_selected = ""

    if (rd_knight.checked) {
        warrior_selected = rd_knight.name
    } else if (rd_archer.checked) {
        warrior_selected = rd_archer.name
    } else if (rd_mage.checked) {
        warrior_selected = rd_mage.name
    } else {
        p_warning_message.style.display = "block"
        return // Salir de la función.
    }

    // Mostrar la imágen del personaje elegido buscando en la lista de
    // user_character el personaje que coincida con el elegido por el usuario.
    player_image.src = user_characters.find(character => character.name ===
        warrior_selected).image
    player_image.alt = warrior_selected

    player_health = user_characters.find(character => character.name ===
        warrior_selected).health

    // Mostrar el jugador elegido.
    spn_player.innerHTML = warrior_selected
    // Ocultar la sección de selección de jugador
    sec_player_selection.style.display = "none"
    // Mostrar las secciones de ataque y mensajes.
    sec_attack_selection.style.display = "flex"
    sec_combat.style.display = "grid"

    select_enemy()

    update_health_points()

    fill_with_skills(warrior_selected)

    create_attack_sequence()
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
    } else if (player == 1 && enemy == 2) {
        result = 1
        enemy_health -= 1 // Resto un punto de vida al enemigo.
    } else if (player == 2 && enemy == 3) {
        result = 1
        enemy_health -= 1 // Resto un punto de vida al enemigo.
    } else if (player == 3 && enemy == 1) {
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


function translate_attack(attack_number) {
    /* 
        DESCRIPTION: Devuelve el nombre del ataque según se su número.
    */

    let selected_attack = ""

    if (attack_number == 1) {
        selected_attack = "tierra 🍃"
    } else if (attack_number == 2) {
        selected_attack = "agua 💧"
    } else {
        selected_attack = "fuego 🔥"
    }
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
    btn_fire.disabled = true
    btn_water.disabled = true
    btn_earth.disabled = true
    // Mostrar el botón reiniciar.
    btn_reset.style.display = "block"
}


function show_status(match_result) {
    /* 
        DESCRIPTION: Muestra mensajes de estado del juego.
    */

    let player_message = document.createElement("p")
    let enemy_message = document.createElement("p")
    let text_player_attack = translate_attack(player_attack)
    let text_enemy_attack = translate_attack(enemy_attack)
    let text_match_result = translate_result(match_result)

    update_health_points()

    // Actualizar mensaje de estado.
    p_result.innerHTML = text_match_result
    player_message.innerHTML = "Ataque de " + text_player_attack
    div_player_attack.appendChild(player_message)
    enemy_message.innerHTML = "Ataque de " + text_enemy_attack
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

    if (div_messages.style.display == "none") {
        div_messages.style.display = "flex"
        div_attack_messages.style.display = "grid"
    }

    if (event.target.id == "btn-earth") {
        player_attack = 1 // Cuerpo a cuarpo
    } else if (event.target.id == "btn-water") {
        player_attack = 2 // Rango
    } else {
        player_attack = 3 // Magia
    }

    // Generar un número entre 1 y 3 que representará el ataque enemigo:
    enemy_attack = aleatorio(1, 3)

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
        // Crear un template literario usando las comillas invertidas ``.
        player_card = `
        <input type="radio" name="${character.name}" id="rd-${character.id}">
        <label class="card" for="rd-${character.id}">
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
        </label>
        `
        div_cards.innerHTML += player_card
    })
}


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */

    // Inicializar los botones del juego.
    btn_select.addEventListener("click", select_warrior)
    btn_reset.addEventListener("click", reset_game)

    // Inicializar las secciones del juego.
    p_warning_message.style.display = "none"
    sec_attack_selection_selection.style.display = "none"
    sec_combat.style.display = "none"
    div_messages.style.display = "none"
    btn_reset.style.display = "none"
    div_attack_messages.style.display = "none"

    fill_with_characters()

    // Inicializar selectores de personajes
    rd_knight = document.getElementById("rd-knight")
    rd_archer = document.getElementById("rd-archer")
    rd_mage = document.getElementById("rd-mage")
}


// Declarar todos los elementos HTML que voy a usar como constantes.
const btn_select = document.getElementById("btn-select")
const btn_reset = document.getElementById("btn-reset")

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

// Declarar variables de uso general.
let user_characters = []
let enemy_characters = []
let player_attacks = []
let player_attack = 0
let enemy_attack = 0
let player_health = 3
let enemy_health = 3
// Declarar variables que tendrán elementos HTML que se llenarán después.
let rd_knight = null
let rd_archer = null
let rd_mage = null
let attack_buttons = []

// Declarar objetos que contendrán los personajes a elegir.
let knight = new Character("knight", "Caballero", "./images/knight.png", 3)
let archer = new Character("archer", "Arquero", "./images/archer.png", 3)
let mage = new Character("mage", "Mago", "./images/mage.png", 3)

// Declarar los objetos que contendrán los enemigos.
let skeleton_soldier = new Character("skeleton_soldier", "Esqueleto soldado",
    "./images/skeleton_soldier.png", 3)
let skeleton_archer = new Character("skeleton_archer", "Esqueleto arquero",
    "./images/skeleton_archer.png", 3)
let skeleton_mage = new Character("skeleton_mage", "Esqueleto mago",
    "./images/skeleton_mage.png", 3)
let orc = new Character("orc", "Orco", "./images/orc.png", 4)
let troll = new Character("troll", "Troll", "./images/troll.png", 5)

// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)

// Agregar habilidades de ataque a cada personaje.
knight.attacks_skills.push(
    { id: "btn-earth", name: "🍃", description: "Tierra 🍃" },
    { id: "btn-earth", name: "🍃", description: "Tierra 🍃" },
    { id: "btn-earth", name: "🍃", description: "Tierra 🍃" },
    { id: "btn-water", name: "💧", description: "Agua 💧" },
    { id: "btn-fire", name: "🔥", description: "Fuego 🔥" }
)

archer.attacks_skills.push(
    { id: "btn-water", name: "💧", description: "Agua 💧" },
    { id: "btn-water", name: "💧", description: "Agua 💧" },
    { id: "btn-water", name: "💧", description: "Agua 💧" },
    { id: "btn-earth", name: "🍃", description: "Tierra 🍃" },
    { id: "btn-fire", name: "🔥", description: "Fuego 🔥" }
)

mage.attacks_skills.push(
    { id: "btn-fire", name: "🔥", description: "Fuego 🔥" },
    { id: "btn-fire", name: "🔥", description: "Fuego 🔥" },
    { id: "btn-fire", name: "🔥", description: "Fuego 🔥" },
    { id: "btn-earth", name: "🍃", description: "Tierra 🍃" },
    { id: "btn-water", name: "💧", description: "Agua 💧" }
)

// Los enemigos tendrán las mismas skills que los personajes a elegir.
skeleton_soldier.attacks_skills.push(knight.attacks_skills)
skeleton_archer.attacks_skills.push(archer.attacks_skills)
skeleton_mage.attacks_skills.push(mage.attacks_skills)

// Agregar todos los objetos character a la lista.
user_characters.push(knight, archer, mage)
// ... y todos los enemigos.
enemy_characters.push(skeleton_soldier, skeleton_archer, skeleton_mage)
