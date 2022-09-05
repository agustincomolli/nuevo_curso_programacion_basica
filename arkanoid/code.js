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

// Definir la opciones de la pala.
var paddle_height = 10
var paddle_width = 75
var paddle_x = (canvas.width - paddle_width) / 2

var right_pressed = false
var left_pressed = false

// Muro de ladrillos.
var brick_row_count = 3
var brick_column_count = 7
var brick_width = 75
var brick_height = 20
var brick_padding = 10
var brick_offset_top = 30
var brick_offset_left = 30
var bricks = []

function collision_detection() {
    // Detectar las colisiones de la bola con los ladrillos.
    let brick = null

    for (col = 0; col < brick_column_count; col++) {
        for (row = 0; row < brick_row_count; row++) {
            brick = bricks[col][row]

            if ((x > brick.x) && (x < brick.x + brick_width) &&
                (y > brick.y) && (y < brick.y + brick_height)) {

                dy = -dy
                brick.status = 0
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
            if (bricks[col][row].status == 0) {
                continue
            }

            brick_x = (col * (brick_width + brick_padding)) + brick_offset_left
            brick_y = (row * (brick_height + brick_padding)) + brick_offset_top
            bricks[col][row].x = brick_x
            bricks[col][row].y = brick_y
            ctx.beginPath()
            ctx.rect(brick_x, brick_y, brick_width, brick_height)
            ctx.fillStyle = "lightblue"
            ctx.fill()
            ctx.closePath()
        }
    }
}


function draw_paddle() {
    // Dibujar paleta.
    ctx.beginPath()
    ctx.rect(paddle_x, (canvas.height - paddle_height - 10), paddle_width, paddle_height)
    ctx.fillStyle = "blue"
    ctx.fill()
    ctx.closePath()
}


function draw_ball() {
    // Dibujar una bola.
    ctx.beginPath()
    ctx.arc(x, y, ball_radius, 0, Math.PI * 2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()
}


function draw() {
    // Borrar canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw_bricks()

    draw_ball()

    draw_paddle()

    collision_detection()

    // Si la bola toca el borde superior, cambiar la dirección.
    if (y + dy < ball_radius) {
        dy = -dy
    } else if (y + dy > canvas.height - ball_radius - 10) {
        // Si toca la paleta, cambiar de dirección.
        if (x > paddle_x && x < paddle_x + paddle_width) {
            dy = -dy
            dy
        } else if (y + dy > canvas.height - ball_radius) {
            // Si toca la parte inferior, se termina el juego.
            alert("¡Juego terminado!")
            document.location.reload()
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


// Repintar todo cada 10 milisegundos.
setInterval(draw, 10)

document.addEventListener("keydown", keydown_handler)
document.addEventListener("keyup", keyup_handler)

for (col = 0; col < brick_column_count; col++) {
    bricks[col] = []
    for (row = 0; row < brick_row_count; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 }
    }
}
