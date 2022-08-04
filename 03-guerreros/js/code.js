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
        enemy_name = "Rey esqueleto"
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


function show_status() {
    /* 
        DESCRIPTION: Muestra mensajes de estado del juego.
    */
    let warrior = document.getElementById("spn-player").innerHTML
    let sec_messages = document.getElementById("sec-messages")
    let enemy = document.getElementById("spn-enemy").innerHTML
    let message = document.createElement("p")

    message.innerHTML = "Tu " + warrior + " lanza un ataque de " +
                        selected_attack + ".<br>El " + enemy +
                        " lanza un ataque de " + enemy_attack + "."

    sec_messages.appendChild(message)
}


function select_enemy_attack() {
    /* 
        DESCRIPTION: Selecciona el ataque del enemigo de forma aleatoria.
    */

    // Generar un número entre 1 y 3 que representará el ataque enemigo:
    // 1 = earth, 2 = wind y 3 = fire
    let attack_number = aleatorio(1, 3)

    if (attack_number == 1) {
        enemy_attack = "tierra"
    } else if (attack_number == 2) {
        enemy_attack = "aire"
    } else {
        enemy_attack = "fuego"
    }

}


function select_attack(event) {
    /* 
        DESCRIPTION: Selecciona el ataque del jugador según el botón 
        presionado indicado por el parámetro "event.target.id".
    */
    if (event.target.id == "btn-earth") {
        selected_attack = "tierra"
    } else if (event.target.id == "btn-wind") {
        selected_attack = "aire"
    } else {
        selected_attack = "fuego"
    }

    select_enemy_attack()
    // Mostrar mensajes de estado.
    show_status()
}


function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */
    let btn_select = document.getElementById("btn-select")
    btn_select.addEventListener("click", select_warrior)
    let btn_earth = document.getElementById("btn-earth")
    btn_earth.addEventListener("click", select_attack)
    let btn_wind = document.getElementById("btn-wind")
    btn_wind.addEventListener("click", select_attack)
    let btn_fire = document.getElementById("btn-fire")
    btn_fire.addEventListener("click", select_attack)
}


let selected_attack = ""
let enemy_attack = ""
// Agregar el EventListener "load" de window para hacer uso del js.
window.addEventListener("load", init)