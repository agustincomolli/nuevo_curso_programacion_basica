function aleatorio(min, max) {
    /* 
        DESCRIPTION: Genera un número aleatorio entre el min y el max.
        PARAMETERS:
                    min = valor mínimo
                    max = valor máximo
    */
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function select_enemy() {
    /* 
        DESCRIPTION: Selecciona un enemigo de forma aleatoria.
    */

    // Generar un número entre 1 y 3 que representará a un enemigo a elegir:
    // 1 = ciclop, 2 = orc y 3 = skeleton
    let enemy_number = aleatorio(1, 3)
    let enemy_name = ""

    if (enemy_number == 1) {
        enemy_name = "Esqueleto soldado"
        enemy_image.src = "./images/skeleton_soldier.png"
    } else if (enemy_number == 2) {
        enemy_name = "Esqueleto arquero"
        enemy_image.src = "./images/skeleton_archer.png"
    } else {
        enemy_name = "Esqueleto mago"
        enemy_image.src = "./images/skeleton_mage.png"
    }

    spn_enemy.innerHTML = enemy_name
}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */

    let warrior_selected = ""

    if (rd_knight.checked) {
        warrior_selected = "Caballero"
        player_image.src = "./images/knight.png"
    } else if (rd_archer.checked) {
        warrior_selected = "Arquero"
        player_image.src = "./images/archer.png"
    } else if (rd_mage.checked) {
        warrior_selected = "Mago"
        player_image.src = "./images/mage.png"
    } else {
        p_warning_message.style.display = "block"
        return // Salir de la función.
    }
    // Mostrar el jugador elegido.
    spn_player.innerHTML = warrior_selected
    //alert("Has seleccionado al " + warrior_selected)
    // Ocultar la sección de selección de jugador
    sec_player_selection.style.display = "none"
    // Mostrar las secciones de ataque y mensajes.
    sec_attack_selection.style.display = "flex"
    sec_combat.style.display = "grid"

    select_enemy()
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

    // Actualizar puntos de vida.
    spn_player_health.innerHTML = "❤️".repeat(player_health)
    spn_enemy_health.innerHTML = "💚".repeat(enemy_health)

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


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */

    // Inicializar los botones del juego.
    btn_select.addEventListener("click", select_warrior)
    btn_fire.addEventListener("click", attack)
    btn_water.addEventListener("click", attack)
    btn_earth.addEventListener("click", attack)
    btn_reset.addEventListener("click", reset_game)
    btn_reset.style.display = "none"

    // Inicializar las secciones del juego.
    sec_attack_selection_selection.style.display = "none"
    sec_combat.style.display = "none"
    div_messages.style.display = "none"
    div_attack_messages.style.display = "none"
    p_warning_message.style.display = "none"
}


// Declarar todos los elementos HTML que voy a usar como constantes.
const btn_select = document.getElementById("btn-select")
const btn_fire = document.getElementById("btn-fire")
const btn_water = document.getElementById("btn-water")
const btn_earth = document.getElementById("btn-earth")
const btn_reset = document.getElementById("btn-reset")
const sec_attack_selection_selection = document.getElementById
    ("sec-attack-selection")
const sec_combat = document.getElementById("sec-combat")
const div_messages = document.getElementById("div-messages")
const div_attack_messages = document.getElementById
    ("div-attack-messages")
const p_warning_message = document.getElementById("p-warning-message")

const div_player_attack = document.getElementById("div-player-attack")
const div_enemy_attack = document.getElementById("div-enemy-attack")
const player = document.getElementById("spn-player").innerHTML
const enemy = document.getElementById("spn-enemy").innerHTML
const spn_player_health = document.getElementById("spn-player_health")
const spn_enemy_health = document.getElementById("spn-enemy_health")
const p_result = document.getElementById("p-result")

const sec_player_selection = document.getElementById("sec-player-selection")
const sec_attack_selection = document.getElementById("sec-attack-selection")
const rd_knight = document.getElementById("rd-knight")
const rd_archer = document.getElementById("rd-archer")
const rd_mage = document.getElementById("rd-mage")
const spn_player = document.getElementById("spn-player")
const player_image = document.getElementById("player-image")

const spn_enemy = document.getElementById("spn-enemy")
const enemy_image = document.getElementById("enemy-image")

// Declarar variables de uso general.
let player_attack = 0
let enemy_attack = 0
let player_health = 3
let enemy_health = 3

// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)