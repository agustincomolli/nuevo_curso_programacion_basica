var canvas = document.getElementById("can-game")
var ctx = canvas.getContext("2d")

var x = canvas.width / 2
var y = canvas.height - 30

var dx = 2
var dy = -2

var ball_radius = 10

var paddle_height = 10
var paddle_width = 75
var paddle_x = (canvas.width - paddle_width) / 2

var right_pressed = false
var left_pressed = false


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

    draw_ball()

    draw_paddle()

    // Si la bola toca el borde superior, cambiar la dirección.
    if (y + dy < ball_radius) {
        dy = -dy
    } else if (y + dy > canvas.height - ball_radius - 10) {
        // Si toca la paleta, cambiar de dirección.
        if (x > paddle_x && x < paddle_x + paddle_width) {
            dy = -dy
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