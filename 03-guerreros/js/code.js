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
        enemy_name = "Esqueleto soldado"
    } else if (enemy_number == 2) {
        enemy_name = "Esqueleto arquero"
    } else {
        enemy_name = "Esqueleto mago"
    }

    spn_enemy.innerHTML = enemy_name
}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */

    let sec_warrior = document.getElementById("sec-warrior")
    let sec_attack = document.getElementById("sec-attack")
    let sec_messages = document.getElementById("sec-messages")
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
    //alert("Has seleccionado al " + warrior_selected)
    // Ocultar la sección de selección de jugador
    sec_warrior.style.display = "none"
    // Mostrar las secciones de ataque y mensajes.
    sec_attack.style.display = "flex"
    sec_messages.style.display = "block"

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
                    1 = cuerpo a cuerpo, 2 = rango y 3 = magia
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
        selected_attack = "cuerpo a cuerpo"
    } else if (attack_number == 2) {
        selected_attack = "rango"
    } else {
        selected_attack = "magia"
    }
    return selected_attack
}


function check_health() {
    /* 
        DESCRIPTION: Revisa si la vida de alguno de los contrincantes está
        en 0 lo que determinará quién ganó el juego.
    */
        
    let sec_messages = document.getElementById("sec-messages")
    let sec_reset = document.getElementById("sec-reset")
    let message = document.createElement("h2")
    let btn_magic = document.getElementById("btn-magic")
    let btn_range = document.getElementById("btn-range")
    let btn_mele = document.getElementById("btn-mele")

    if (enemy_health == 0) {
        message.innerHTML = "¡Ganaste! 🥳🏆"
    } else if (player_health == 0) {
       message.innerHTML = "¡Perdiste! 😭🥀"
    } else {
        return
    }
    
    sec_messages.appendChild(message)

    // Deshabilitar botones de ataque.
    btn_magic.disabled = true
    btn_range.disabled = true
    btn_mele.disabled = true
    // Mostrar el botón reiniciar.
    sec_reset.style.display = "block"
}


function show_status(match_result) {
    /* 
        DESCRIPTION: Muestra mensajes de estado del juego.
    */
    
    let sec_messages = document.getElementById("sec-messages")
    let player = document.getElementById("spn-player").innerHTML
    let enemy = document.getElementById("spn-enemy").innerHTML
    let spn_player_health = document.getElementById("spn-player_health")
    let spn_enemy_health = document.getElementById("spn-enemy_health")
    let message = document.createElement("p")
    let text_player_attack = translate_attack(player_attack)
    let text_enemy_attack = translate_attack(enemy_attack)
    let text_match_result = translate_result(match_result)

    // Actualizar puntos de vida.
    spn_player_health.innerHTML = player_health
    spn_enemy_health.innerHTML = enemy_health
    // Actualizar mensaje de estado.
    message.innerHTML = "Tu " + player + " lanza un ataque de " +
                        text_player_attack + ".<br>El " + enemy +
                        " lanza un ataque de " + text_enemy_attack + "." + 
                        "<br>" + text_match_result

    sec_messages.appendChild(message)

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
    let spn_player = document.getElementById("spn-player")

    // Verificar que antes de un ataque se haya seleccionado un guerrero.
    if (spn_player.innerHTML == "guerrero") {
        alert("Debes seleccionar un guerrero para poder realizar un ataque.")
        return
    }
    
    if (event.target.id == "btn-mele") {
        player_attack = 1 // Cuerpo a cuarpo
    } else if (event.target.id == "btn-range") {
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
    let btn_select = document.getElementById("btn-select")
    btn_select.addEventListener("click", select_warrior)
    let btn_magic = document.getElementById("btn-magic")
    btn_magic.addEventListener("click", attack)
    let btn_range = document.getElementById("btn-range")
    btn_range.addEventListener("click", attack)
    let btn_mele = document.getElementById("btn-mele")
    btn_mele.addEventListener("click", attack)
    let btn_reset = document.getElementById("btn-reset")
    btn_reset.addEventListener("click", reset_game)
    let sec_attack = document.getElementById("sec-attack")
    sec_attack.style.display ="none"
    let sec_messages = document.getElementById("sec-messages")
    sec_messages.style.display = "none"
}


let player_attack = 0
let enemy_attack = 0
let player_health = 3
let enemy_health = 3

// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)