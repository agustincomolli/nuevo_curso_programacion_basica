function aleatorio(min, max) {
    /* 
        DESCRIPTION: Genera un número aleatorio entre el min y el max.
        PARAMETERS:
                    min = valor mínimo
                    max = valor máximo
    */
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function get_choice(move) {
    /* 
        DESCRIPTION: Devuelve una cadena con la elección para el juego.
        PARAMETERS:
                    move = es la elección del jugador o la pc
    */
    let result = ""
    if (move == 1) {
        result += "Piedra 🪨"
    } else if (move == 2) {
        result += "Papel 🧻"
    } else if (move == 3) {
        result += "Tijera ✂️"
    } else {
        result += "cualquier cosa 😒"
    }

    return result
}


function lets_combat(player_1, player_2) {
    /* 
        DESCRIPTION: Devuelve un entero con el resultado del juego.
                     Si es 0 es empate, si es 1 gana player_1 y si
                     es 2 gana player_2.
        PARAMETERS:
                    player_1 = primer jugador.
                    player_2 = segundo jugador.
    */
    let result = 0

    if (player_1 == player_2) {
        result = 0
    } else if (player_1 == 1 && player_2 == 3) {
        result = 1
    } else if (player_1 == 2 && player_2 == 1) {
        result = 1
    } else if (player_1 == 3 && player_2 == 2) {
        result = 1
    } else {
        result = 2
    }

    return result
}


let player = 0
let pc = 0
let victories = 0
let defeats = 0
let match_result = 0

while (victories < 3 && defeats < 3) {
    player = prompt("Elige:\n1 - Piedra 🪨\n2 - Papel 🧻\n3 - Tijera ✂️")
    message = "Elegiste " + get_choice(player)
    alert(message)

    // Generar un número aleatorio entre 1 y 3.
    pc = aleatorio(1, 3)
    message = "La PC eligió " + get_choice(pc)
    alert(message)

    match_result = lets_combat(player, pc)
    // 0 = empate, 1 = victoria, 2 = derrota
    if (match_result == 1) {
        message = "¡Ganaste! 😎"
        victories += 1 // Suma 1 victoria
    } else if (match_result == 2) {
        message = "¡Perdiste! 😢"
        defeats += 1 // Suma 1 derrota
    } else {
        message = "¡Empate! 😐"
    }
    alert(message)
}
alert("Ganaste: " + victories + "\nPerdiste: " + defeats)
