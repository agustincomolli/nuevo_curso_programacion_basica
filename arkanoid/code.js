var canvas = document.getElementById("can-game")
var ctx = canvas.getContext("2d")

// Coordenadas de la bola
var x = canvas.width / 2
var y = canvas.height - 30

// Dirección o velocidad de la bola.
var dx = 2
var dy = -2

// Tamaño de la bola.
var ball_radius = 10
var ball_color = "red"

// Definir la opciones de la pala.
var paddle_height = 10
var paddle_width = 75
var paddle_x = (canvas.width - paddle_width) / 2

var right_pressed = false
var left_pressed = false

// Muro de ladrillos.
var brick_row_count = 5
var brick_column_count = 7
var brick_width = 75
var brick_height = 20
var brick_padding = 10
var brick_offset_top = 60
var brick_offset_left = (canvas.width -
    (brick_column_count * (brick_width + brick_padding))) / 2
var bricks = []

var score = 0
var lives = 3

var div_message = document.getElementById("div-message")
var spn_message = document.getElementById("spn-message")
var btn_reset = document.getElementById("btn-reset")


function draw_lives() {
    // Mostrar la cantidad de vidas.
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#EEEEEE"
    ctx.fillText("Vidas: " + lives, canvas.width - 75, 30)
}


function reset_game() {
    // Reiniciar el juego.
    document.location.reload()
}

function mouse_move_handler(event) {
    // Asociar el moviento de la pala con el mouse.

    let relative_x = event.clientX - canvas.offsetLeft

    if (relative_x > 0 && relative_x < canvas.width) {
        paddle_x = relative_x
    }
}


function get_random_color() {
    // Genera un color aleatorio.
    let letters = "0123456789ABCDF"
    let color = "#"

    for (index = 0; index < 6; index++) {
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}


function draw_score() {
    // Dibujar marcador de puntos.
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#EEEEEE"
    ctx.fillText("Puntos: " + score, 20, 30)
}


function collision_detection() {
    // Detectar las colisiones de la bola con los ladrillos.
    let brick = null

    for (col = 0; col < brick_column_count; col++) {
        for (row = 0; row < brick_row_count; row++) {
            brick = bricks[col][row]

            // Si el status es 0 no detectar la colisión.
            if (brick.status == 0) {
                continue
            }

            if ((x > brick.x) && (x < brick.x + brick_width) &&
                (y > brick.y) && (y < brick.y + brick_height)) {

                dy = -dy
                brick.status = 0
                score += 10
                // Aumentar la velocidad.
                dx += 0.5
                dy += 0.5

                if (score == (brick_column_count * brick_row_count) * 10) {
                    dx = 0
                    dy = 0
                    spn_message.innerHTML = "¡Felicitaciones, ganaste!"
                    div_message.style.display = "flex"
                }
            }
        }
    }
}


function draw_bricks() {
    // Dibujar los ladrillos ne la pantalla.
    let brick_x = 0
    let brick_y = 0
    for (col = 0; col < brick_column_count; col++) {
        for (row = 0; row < brick_row_count; row++) {

            // Si el status es 0 no dibujar el ladrillo.
            if (bricks[col][row].status == 0) {
                continue
            }

            brick_x = (col * (brick_width + brick_padding)) + brick_offset_left
            brick_y = (row * (brick_height + brick_padding)) + brick_offset_top
            bricks[col][row].x = brick_x
            bricks[col][row].y = brick_y
            ctx.beginPath()
            ctx.rect(brick_x, brick_y, brick_width, brick_height)
            ctx.fillStyle = "#00ADB5"
            ctx.fill()
            ctx.closePath()
        }
    }
}


function draw_paddle() {
    // Dibujar paleta.
    ctx.beginPath()
    ctx.rect(paddle_x, (canvas.height - paddle_height - 10),
        paddle_width, paddle_height)
    ctx.fillStyle = "#EEEEEE"
    ctx.fill()
    ctx.closePath()
}


function draw_ball(color) {
    // Dibujar una bola.
    ctx.beginPath()
    ctx.arc(x, y, ball_radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}


function draw() {
    // Borrar canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    collision_detection()

    draw_bricks()

    draw_ball(ball_color)

    draw_paddle()

    draw_score()

    draw_lives()

    // Si la bola toca el borde superior, cambiar la dirección.
    if (y + dy < ball_radius) {
        dy = -dy
    } else if (y + dy > canvas.height - ball_radius - 10) {
        // Si toca la paleta, cambiar de dirección.
        if (x > paddle_x && x < paddle_x + paddle_width) {
            dy = -dy
            dy
            ball_color = get_random_color()
        } else if (y + dy > canvas.height - ball_radius) {
            // Si toca la parte inferior, restar vida.
            lives--
            // Si no tiene más vidas...
            if (!lives) {
                dy = 0
                dx = 0
                spn_message.innerHTML = "¡GAME OVER!"
                div_message.style.display = "flex"
            } else {
                // Empezar por el medio.
                x = canvas.width / 2
                y = canvas.height - 30
                paddle_x = (canvas.width - paddle_width) / 2
            }
        }
    }

    // Si la bola toca los bordes izquierdo y derecho, cambiar la dirección.
    if (x + dx < ball_radius || x + dx > canvas.width - ball_radius) {
        dx = -dx
    }

    // Actualizar posición.
    x += dx
    y += dy

    // Si se presionó izquierda o derecha, mover la paleta.
    if (right_pressed && paddle_x < canvas.width - paddle_width) {
        paddle_x += 7
    } else if (left_pressed && paddle_x > 0) {
        paddle_x -= 7
    }

    // Refrescar la pantalla.
    requestAnimationFrame(draw)
}


function keydown_handler(e) {
    // Si se presionó la tecla izquierda o derecha activar la variable correspondiente.
    if (e.key == "ArrowLeft") {
        left_pressed = true
    } else if (e.key == "ArrowRight") {
        right_pressed = true
    }
}


function keyup_handler(e) {
    // Si se soltó la flecha izquierda o derecha desactivar la variable correspondiente.
    if (e.key == "ArrowLeft") {
        left_pressed = false
    } else if (e.key == "ArrowRight") {
        right_pressed = false
    }
}


div_message.style.display = "none"

document.addEventListener("keydown", keydown_handler)
document.addEventListener("keyup", keyup_handler)
document.addEventListener("mousemove", mouse_move_handler)
btn_reset.addEventListener("click", reset_game)

for (col = 0; col < brick_column_count; col++) {
    bricks[col] = []
    for (row = 0; row < brick_row_count; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 }
    }
}

// Pintar el canvas
draw()
