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
    let spn_enemy = document.getElementById("spn-enemy")

    if (enemy_number == 1) {
        enemy_name = "Cíclope"
    } else if (enemy_number == 2) {
        enemy_name = "Orco"
    } else {
        enemy_name = "Rey Esqueleto"
    }

    spn_enemy.innerHTML = enemy_name
}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */
    let rd_knight = document.getElementById("rd-knight")
    let rd_archer = document.getElementById("rd-archer")
    let rd_mage = document.getElementById("rd-mage")
    let spn_player = document.getElementById("spn-player")
    let warrior_selected = ""

    if (rd_knight.checked) {
        warrior_selected = "Caballero"
    } else if (rd_archer.checked) {
        warrior_selected = "Arquero"
    } else if (rd_mage.checked) {
        warrior_selected = "Mago"
    } else {
        alert("Debes seleccionar un guerrero para luchar")
        return // Salir de la función.
    }
    // Mostrar el jugador elegido.
    spn_player.innerHTML = warrior_selected
    alert("Has seleccionado al " + warrior_selected)

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
                    1 = fuego, 2 = viento y 3 = tierra
    */
    let result = 0

    if (player == enemy) {
        result = 0
    } else if (player == 1 && enemy == 3) {
        result = 1
    } else if (player == 2 && enemy == 1) {
        result = 1
    } else if (player == 3 && enemy == 2) {
        result = 1
    } else {
        result = 2
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
        selected_attack = "fuego"
    } else if (attack_number == 2) {
        selected_attack = "viento"
    } else {
        selected_attack = "tierra"
    }
    return selected_attack
}


function show_status(match_result) {
    /* 
        DESCRIPTION: Muestra mensajes de estado del juego.
    */
    
    let warrior = document.getElementById("spn-player").innerHTML
    let sec_messages = document.getElementById("sec-messages")
    let enemy = document.getElementById("spn-enemy").innerHTML
    let message = document.createElement("p")
    let text_player_attack = translate_attack(player_attack)
    let text_enemy_attack = translate_attack(enemy_attack)
    let text_match_result = translate_result(match_result)

    message.innerHTML = "Tu " + warrior + " lanza un ataque de " +
                        text_player_attack + ".<br>El " + enemy +
                        " lanza un ataque de " + text_enemy_attack + "." + 
                        "<br>" + text_match_result

    sec_messages.appendChild(message)
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
    
    if (event.target.id == "btn-fire") {
        player_attack = 1 // Fuego
    } else if (event.target.id == "btn-wind") {
        player_attack = 2 // Viento
    } else {
        player_attack = 3 // Tierra
    }

    // Generar un número entre 1 y 3 que representará el ataque enemigo:
    enemy_attack = aleatorio(1, 3)

    match_result = lets_combat(player_attack, enemy_attack)

    // Mostrar mensajes de estado.
    show_status(match_result)
}


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */
    let btn_select = document.getElementById("btn-select")
    btn_select.addEventListener("click", select_warrior)
    let btn_fire = document.getElementById("btn-fire")
    btn_fire.addEventListener("click", attack)
    let btn_wind = document.getElementById("btn-wind")
    btn_wind.addEventListener("click", attack)
    let btn_earth = document.getElementById("btn-earth")
    btn_earth.addEventListener("click", attack)
}


let player_attack = 0
let enemy_attack = 0
// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)